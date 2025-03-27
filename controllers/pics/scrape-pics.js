import dbModel from "../../models/db.js";
import CONFIG from "../../config/scrape-config.js";

export const scrapePicsClick = async (inputParams) => {
  const { scrapeType, howMany, scrapeTo, tgId, pullNewData } = inputParams;

  //if user selects new data
  if (pullNewData === "yesNewData") {
    await scrapePicsAuto();
  }

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
    // console.log(tgData);
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
