import dbModel from "../models/db.js";
import CONFIG from "../config/scrape-config.js";
import { runGetNewData } from "./scraper-run.js";

export const runScrapeBoth = async () => {
  await runGetNewData(inputParams);
  console.log("scrape both");
};

export const runScrapePics = async (inputParams) => {
  const { howMany, scrapeTo, tgId } = inputParams;
  await runGetNewData(inputParams);

  const modelObj = {
    keyToLookup: "kcnaId",
    howMany: howMany,
  };

  const dataModel = new dbModel(modelObj, CONFIG.downloadedCollection);
  const picDataArray = await dataModel.getLastItemsArray();

  //add check for sending to tg
  if (scrapeTo === "displayTG") {
    //send anything new to tg
    const tgData = await uploadPicsFS(tgId);
    console.log(tgData);
    return { data: "DATA POSTED TO TG" };
  }

    //if empty
    if (picDataArray.length === 0) {
      picDataArray.empty = "YES"
      return picDataArray;
    }

  //otherwise return picDataArray
  return picDataArray;
};

export const runScrapeArticles = async (inputParams) => {
  const { howMany, scrapeTo, tgId } = inputParams;
  //returns null if set to no new data
  await runGetNewData(inputParams);

  //pull requested data
  const modelObj = {
    keyToLookup: "myId",
    howMany: howMany,
  };

  const dataModel = new dbModel(modelObj, CONFIG.articleContentCollection);
  const articleDataArray = await dataModel.getLastItemsArray();

  //add check for sending to tg instead
  if (scrapeTo === "displayTG") {
    //send anything new to tg
    const tgData = await postArticlesLoop(tgId);
    console.log(tgData);
    return "DATA POSTED TO TG";
  }

  //if empty
  if (articleDataArray.length === 0) {
    articleDataArray.empty = "YES";
    console.log(articleDataArray);
    return articleDataArray;
  }

  //otherwise process on frontend
  return articleDataArray;
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
