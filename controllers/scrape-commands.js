import dbModel from "../models/db.js";
import CONFIG from "../config/scrape-config.js";
import { runGetNewData } from "./scraper-run.js";

export const runScrapeBoth = async () => {
  console.log("scrape both");
  console.log("NOT BUILT");
  await runGetNewData(inputParams);
};

export const runScrapePics = async (inputParams) => {
  const { scrapeType, howMany, scrapeTo, tgId } = inputParams;
  await runGetNewData(inputParams);

  const modelObj = {
    keyToLookup: "kcnaId",
    howMany: howMany,
  };

  const dataModel = new dbModel(modelObj, CONFIG.downloadedCollection);
  const picDataArray = await dataModel.getLastItemsArray();

  //SHOULD RENAME COMBINE WITH BELOW
  const returnObj = {
    dataArray: picDataArray,
    dataType: scrapeType,
  };

  const uploadObj = {
    picArray: picDataArray,
    postToId: tgId, //defaults to same as config
  };

  //add check for sending to tg
  if (scrapeTo === "displayTG") {
    //send anything new to tg
    const tgData = await uploadPicsFS(uploadObj);
    console.log(tgData);
    return { data: "DATA POSTED TO TG" };
  }

  //if empty //UNFUCK
  if (picDataArray.length === 0) {
    picDataArray.empty = "YES";
    return picDataArray;
  }

  //otherwise return obj
  return returnObj;
};

export const runScrapeArticles = async (inputParams) => {
  const { scrapeType, howMany, scrapeTo, tgId } = inputParams;
  //returns null if set to no new data
  await runGetNewData(inputParams);

  //pull requested data
  const modelObj = {
    keyToLookup: "myId",
    howMany: howMany,
  };

  const dataModel = new dbModel(modelObj, CONFIG.articleContentCollection);
  const articleDataArray = await dataModel.getLastItemsArray();

  const returnObj = {
    dataArray: articleDataArray,
    dataType: scrapeType,
  };

  //add check for sending to tg instead
  if (scrapeTo === "displayTG") {
    //send anything new to tg
    const tgData = await postArticlesLoop(tgId);
    console.log(tgData);
    return "DATA POSTED TO TG";
  }

  //if empty //UNFUCK
  if (articleDataArray.length === 0) {
    articleDataArray.empty = "YES";
    console.log(articleDataArray);
    return articleDataArray;
  }

  //otherwise return obj and process on frontend
  return returnObj;
};

export const runScrapeURL = async () => {
  console.log("scrapeURL");
};

// const params = {
//   route: "/scrape-submit-route",
//   scrapeType: d.scrapeType.value,
//   scrapeTo: d.scrapeTo.value,
//   urlInput: d.urlInput.value,
//   howMany: d.howMany.value,
//   tgId: d.tgId.value,
//   pullNewData: d.pullNewData.value,
// };
