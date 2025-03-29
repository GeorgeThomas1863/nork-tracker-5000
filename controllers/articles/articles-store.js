import CONFIG from "../../config/scrape-config.js";
import dbModel from "../../models/db.js";

//stores list of articles (from main page)
export const storeArticleArray = async (inputArray) => {
  for (let i = 0; i < inputArray.length; i++) {
    //should all be unique, no need for try catch
    const urlObj = inputArray[i];
    const storeModel = new dbModel(urlObj, CONFIG.articleListCollection);
    const storeURL = await storeModel.storeUniqueURL();
    // console.log(storeURL);
  }
  return true;
};

//stores article obj (from single article)
export const storeArticleObj = async (inputData) => {
  try {
    const storeModel = new dbModel(inputData, CONFIG.articleContentCollection);
    const storeData = await storeModel.storeUniqueURL();
    return storeData;
  } catch (e) {
    console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
  }

  return true
};

//LOG article lookups //CAN TURN OFF
export const logArticleLookup = async (articleListHtml) => {
  //pull first 50 characters just to ensure working
  const sampleHtml = articleListHtml.trim().substring(50, 200);
  const dateTime = new Date().toISOString();

  //store params
  const params = {
    html: sampleHtml,
    dateTime: dateTime,
  };

  //store data
  const storeModel = new dbModel(params, CONFIG.articleLogCollection);
  await storeModel.storeAny();
};
