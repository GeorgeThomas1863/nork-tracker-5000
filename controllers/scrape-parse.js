import CONFIG from "../config/scrape-config.js";
import { getArticlesAuto } from "./articles/articles-get.js";
import { postArticlesAuto } from "./articles/articles-post.js";
import { scrapeArticlesClick } from "./articles/scrape-articles.js";
import { scrapePicsClick } from "./pics/scrape-pics.js";
import { scrapePicsAuto } from "./pics/pics-main.js";

export const parseCommand = async (req, res) => {
  const inputParams = await setInputParamsDefaults(req.body);
  console.log(inputParams);

  //run command based on input
  let data = "";
  switch (inputParams.scrapeType) {
    case "scrapeBoth":
      data = await runScrapeBoth(inputParams);
      break;

    case "scrapePics":
      data = await scrapePicsClick(inputParams);
      break;

    case "scrapeArticles":
      data = await scrapeArticlesClick(inputParams);
      break;

    case "scrapeURL":
      data = await runScrapeURL(inputParams);
      break;

    case "restartAuto":
      console.log("PARSER");
      data = await runRestartAutoScraper(inputParams);
      break;
  }

  return res.json(data);
};

const setInputParamsDefaults = async (inputParams) => {
  const returnObj = { ...inputParams }; //destructure input

  const defaultInput = {
    scrapeType: CONFIG.defaultScrapeType,
    scrapeTo: CONFIG.defaultScrapeTo,
    tgId: CONFIG.defaultTgId, //forwardTest53
    howMany: CONFIG.defaultHowMany,
    pullNewData: CONFIG.defaultPullNew,
  };

  //if input exists move on
  for (let key1 in inputParams) {
    if (inputParams[key1] !== "" && inputParams[key1] !== 0) {
      continue;
    }

    for (let key2 in defaultInput) {
      if (key2 === key1) {
        returnObj[key1] = defaultInput[key2];
      }
    }
  }
  return returnObj;
};

export const runScrapeBoth = async () => {
  console.log("scrape both");
  console.log("NOT BUILT");
  await runGetNewData(inputParams);
};

export const runRestartAutoScraper = async (inputParams) => {
  //MAKE WAY TO HANDLE SETTING TG ID

  //HAVE IT RESTART HOURLY SCRAPER, JUST GETTING NEW DATA FOR TESTING
  await getArticlesAuto();
  await scrapePicsAuto();
  console.log("FINISHED FUCKER");

  //long ass way to do it below
  // const autoObj = { ...inputParams }; //destructure input
  // autoObj.scrapeType = "scrapeBoth";
  // autoObj.pullNewData = "yesNewData"; //turn on dumbass

  // const data = await runGetNewData(autoObj);
  // console.log(data);
  // console.log("FINISHED FUCKER");

  return data;
};

//just run once
export const runGetNewData = async (inputParams) => {
  const { pullNewData, scrapeType } = inputParams;

  //check if get new data on
  if (pullNewData === "noNewData") return null;
  switch (scrapeType) {
    case "scrapeArticles":
      await getArticlesAuto();
      await postArticlesAuto();
      console.log("FINISHED SCRAPING ARTICLES");
      break;

    case "scrapePics":
      await scrapePicsAuto();
      console.log("FINISHED SCRAPING PICS");
      break;

    case "scrapeBoth":
      await getArticlesAuto();
      await postArticlesAuto();
      await scrapePicsAuto();
      console.log("FINISHED SCRAPING ARTICLES AND PICS");
      break;
  }

  console.log("FINISHED GETTING NEW DATA");
  return true;
};

export const runScrapeURL = async () => {
  console.log("scrapeURL");
};
