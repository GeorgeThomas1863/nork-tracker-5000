import dbModel from "../../models/db.js";
import CONFIG from "../../config/scrape-config.js";

export const scrapeArticlesClick = async (inputParams) => {
  const { scrapeType, howMany, scrapeTo, tgId, pullNewData } = inputParams;

  //if set to new run scrape articles
  if (pullNewData === "yesNewData") {
    await getArticlesAuto();
    await postArticlesAuto();
  }

  //get article data from mongo
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

// export const runGetNewData = async (inputParams) => {
//   const { pullNewData, scrapeType } = inputParams;

//   //check if get new data on
//   if (pullNewData === "noNewData") return null;
//   switch (scrapeType) {
//     case "scrapeArticles":
//       await getArticlesAuto();
//       await postArticlesAuto();
//       break;

//     case "scrapePics":
//       await scrapePicsAuto();
//       break;

//     case "scrapeBoth":
//       await getArticlesAuto();
//       await postArticlesAuto();
//       await scrapePicsAuto();
//       break;
//   }

//   console.log("FINISHED GETTING NEW DATA");
//   return;
// };
