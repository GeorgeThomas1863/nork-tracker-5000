import CONFIG from "../../config/scrape-config.js";
import { runScrapeBoth, runScrapePics, runScrapeArticles, runScrapeURL } from "./scrape-commands.js";
import { runRestartAutoScraper } from "./scraper-run.js";

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
      data = await runScrapePics(inputParams);
      break;

    case "scrapeArticles":
      data = await runScrapeArticles(inputParams);
      break;

    case "scrapeURL":
      data = await runScrapeURL(inputParams);
      break;

    case "restartAuto":
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
