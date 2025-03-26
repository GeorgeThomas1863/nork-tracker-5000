import dbModel from "../../models/db.js";
import CONFIG from "../../config/scrape-config.js";
import { sendMessageChunkTG } from "../tg-api.js";

//default post to
export const postArticlesAuto = async (postToId = CONFIG.articleSendToId) => {
  //check if any new articles
  const articleObj = {
    collection1: CONFIG.articleContentCollection,
    collection2: CONFIG.articlePostedCollection,
  };

  const articleModel = new dbModel(articleObj, "");
  const articleArray = await articleModel.findNewURLs();
  console.log(articleArray);
  if (articleArray.length === 0) return null; //no new articles to post

  //loop through ARTICLE array
  for (let i = 0; i < articleArray.length; i++) {
    try {
      //normalize data and post
      const articleObj = articleArray[i];
      const normalObj = await normalizeInputsTG(articleObj);

      //add post to to object
      normalObj.postToId = postToId;
      const sendMessageData = await handleSendMessage(normalObj);
      console.log(sendMessageData);

      //store original object, not normalized data
      const storeModel = new dbModel(articleObj, CONFIG.articlePostedCollection);
      await storeModel.storeUniqueURL();
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
      continue;
    }
  }
  return articleArray.length;
};

//normalize tg message
export const normalizeInputsTG = async (inputObj) => {
  const urlRaw = inputObj.url;
  const urlNormal = urlRaw.replace(/\./g, "[.]").replace(/:/g, "[:]");
  const dateRaw = inputObj.date;
  const dateNormal = new Date(dateRaw).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  const titleNormal = `<b>${inputObj.title}</b>`;

  const outputObj = {
    url: urlNormal,
    date: dateNormal,
    title: titleNormal,
    content: inputObj.content,
  };

  return outputObj;
};

//chunk content logic if too long
export const handleSendMessage = async (inputObj) => {
  const { url, date, title, content, postToId } = inputObj; //destructure everything
  const maxLength = CONFIG.tgMaxLength - title.length - date.length - url.length - 100;
  const chunkTotal = Math.ceil(content.length / maxLength);
  let chunkCount = 0;

  //set  base params
  const params = {
    chat_id: postToId,
    parse_mode: "HTML",
  };

  //if short enough send normally
  if (content.length < maxLength) {
    params.text = title + "\n" + date + "\n\n" + content + "\n\n" + url;
    await sendMessageChunkTG(params);
    return content.length;
  }

  //otherwise send in chunks
  for (let i = 0; i < content.length; i += maxLength) {
    chunkCount++;
    const chunk = content.substring(i, i + maxLength);
    //if first message
    if (chunkCount === 1) {
      params.text = title + "\n" + date + "\n\n" + chunk;
      await sendMessageChunkTG(params);
      continue;
    }

    //if last messagse
    if (chunkCount === chunkTotal) {
      params.text = chunk + "\n\n" + url;
      await sendMessageChunkTG(params);
      continue;
    }

    //otherwise send just chunk
    params.text = chunk;
    await sendMessageChunkTG(params);
  }

  return content.length;
};
