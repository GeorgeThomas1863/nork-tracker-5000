import { scrapeArticles } from "./articles-get.js";
import { postArticlesLoop } from "./articles-post.js";
import { scrapePics } from "./pics.js";

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
      await scrapeArticles();
      await postArticlesLoop();
      break;

    case "scrapePics":
      await scrapePics();
      break;

    case "scrapeBoth":
      await scrapeArticles();
      await postArticlesLoop();
      await scrapePics();
      break;
  }

  console.log("FINISHED GETTING NEW DATA");
  return;
};
