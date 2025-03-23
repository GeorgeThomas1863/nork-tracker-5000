import dbModel from "../models/db.js";
import CONFIG from "../config/scrape-config.js";
import { runGetNewData } from "./scraper-run.js";

export const runScrapeBoth = async () => {
  await runGetNewData(inputParams);
  console.log("scrape both");
};

export const runScrapePics = async (inputParams) => {
  await runGetNewData(inputParams);
  // const { howMany, scrapeTo, pullNew } = inputParams;

  // //pull new data if set
  // if (pullNew === "yesNewData") await runGetNewData(inputParams);

  // //pull lastet downloaded from db
  // return "FUCK YOU FAGGOT";
  console.log("FUCK YOU FAGGOT");
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


  //process on frontend
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
