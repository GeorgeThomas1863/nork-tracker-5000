import { getArticlesAuto } from "../articles/articles-get.js";
import { postArticlesAuto } from "../articles/articles-post.js";
import { scrapePicsAuto } from "../pics/pics-main.js";
import { scrapeKCNA } from "./scrape-main.js";

export const runRestartAutoScraper = async (inputParams) => {
  //MAKE WAY TO HANDLE SETTING TG ID

  const data = await scrapeKCNA();
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
      break;

    case "scrapePics":
      await scrapePicsAuto();
      break;

    case "scrapeBoth":
      await getArticlesAuto();
      await postArticlesAuto();
      await scrapePicsAuto();
      break;
  }

  console.log("FINISHED GETTING NEW DATA");
  return;
};
