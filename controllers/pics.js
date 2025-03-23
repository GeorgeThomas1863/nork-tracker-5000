import CONFIG from "../config/scrape-config.js";
import KCNA from "../models/kcna.js";
import dbModel from "../models/db.js";

import { uploadPicsTG, editCaptionTG } from "./tg-api.js";

export const scrapePics = async () => {
  const newPicUrls = await getPicURLs();
  console.log(newPicUrls);
  const downloadPics = await downloadPicsFS();
  console.log(downloadPics);

  //post to id not necessary but included
  const postToId = CONFIG.articleSendToId;
  const uploadPics = await uploadPicsFS(postToId);
  console.log(uploadPics);

  return newPicUrls;
};

export const getPicURLs = async () => {
  //get date array
  const dateArray = await getDateArray();
  const currentKcnaId = await getCurrentKcnaId();

  //loop 200 (400 lookups an hour)
  const startId = currentKcnaId - 100;
  const stopId = currentKcnaId + 100;

  let arrayIndex = 0;

  //loop
  for (let i = startId; i <= stopId; i++) {
    console.log(i);
    for (let k = 0; k < dateArray.length; k++) {
      try {
        const dateString = dateArray[arrayIndex];
        const url = CONFIG.picBaseURL + dateString + "/PIC00" + i + ".jpg";
        console.log(url);
        const urlObj = {
          url: url,
        };

        //check if already have url BEFORE http req
        const checkModel = new dbModel(urlObj, CONFIG.picCollection);
        await checkModel.urlNewCheck(); //will throw error if not new

        //http req
        const kcnaModel = new KCNA(urlObj);
        const dataType = await kcnaModel.getDataType();

        //if not pic move on
        if (dataType !== "image/jpeg") {
          arrayIndex++;
          if (arrayIndex > 2) arrayIndex = 0; //reset array, CHANGE number
          continue;
        }

        //build pic path HERE
        console.log("AHHHHH"); //store it
        const picPath = CONFIG.savePicPathBase + i + ".jpg";
        const storeParams = {
          url: url,
          kcnaId: i,
          dateString: dateString,
          picPath: picPath,
        };

        const dataModel = new dbModel(storeParams, CONFIG.picCollection);
        const storePicData = await dataModel.storeUniqueURL();
        console.log(storeParams);
        console.log(storePicData);
        break;
      } catch (e) {
        console.log(e.message + "; URL: " + e.url + "; BREAK: " + e.function);
        break;
      }
    }
  }
  return true;
};

//KCNA Download attempt 2
export const downloadPicsFS = async () => {
  // //TURN BACK ON
  const picArray = await getPicArray("picsToDownload");
  console.log(picArray);

  //loop //TURN ON
  for (let i = 0; i < picArray.length; i++) {
    try {
      const pic = picArray[i];

      const downloadPicParams = {
        url: pic.url,
        savePath: pic.picPath,
      };

      //download pic
      const downloadPicModel = new KCNA(downloadPicParams);
      const downloadPicData = await downloadPicModel.downloadPicFS();
      console.log(downloadPicData);

      //store pic was downloaded
      const storePicModel = new dbModel(pic, CONFIG.downloadedCollection);
      const storePicDownloaded = await storePicModel.storeUniqueURL();
      console.log(storePicDownloaded);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
    }
  }
};

export const uploadPicsFS = async (postToId = CONFIG.articleSendToId) => {
  const picArray = await getPicArray("picsToUpload");
  console.log(picArray);

  for (let i = 0; i < picArray.length; i++) {
    try {
      const pic = picArray[i];
      const params = {
        chatId: postToId,
        picPath: pic.picPath,
      };

      //upload pic
      const uploadPicData = await uploadPicsTG(params);
      // console.log(uploadPicData)

      //edit caption
      const defangURL = pic.url.replace(/\./g, "[.]").replace(/:/g, "[:]");
      const normalURL = defangURL.substring(15);
      const caption = "ID: " + pic.kcnaId + "; URL: " + normalURL;
      const editCaptionData = await editCaptionTG(uploadPicData, caption);
      console.log(editCaptionData);

      //store pic was uploaded
      const storePicModel = new dbModel(pic, CONFIG.uploadedCollection);
      const storePicDownloaded = await storePicModel.storeUniqueURL();
      console.log(storePicDownloaded);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
    }
  }
};

//-----------------------
//HELPER FUNCTIONS

export const getDateArray = async () => {
  const currentDate = new Date();
  const dateArray = [];

  for (let i = -1; i < 2; i++) {
    const date = new Date(currentDate);

    date.setMonth(currentDate.getMonth() + i);

    // Get month (0-11) and add 1 to get 1-12 range
    const monthRaw = date.getMonth() + 1;

    // Pad month with leading zero if needed
    const month = monthRaw.toString().padStart(2, "0");

    // Get full year
    const year = date.getFullYear();

    // Add month+year string to result array
    dateArray.push(year + "" + month);
  }

  return dateArray;
};

//get array of new pics to download  //find dif between pics downloaded and pics posted
const getPicArray = async (type) => {
  let params = "";

  if (type !== "picsToDownload" && type !== "picsToUpload") return;

  if (type === "picsToDownload") {
    params = {
      collection1: CONFIG.picCollection, //old thing, to compare against
      collection2: CONFIG.downloadedCollection, //new thing, what this funct is doing
    };
  }

  if (type === "picsToUpload") {
    params = {
      collection1: CONFIG.downloadedCollection,
      collection2: CONFIG.uploadedCollection,
    };
  }

  const picModel = new dbModel(params, "");
  const picArray = await picModel.findNewURLs();
  return picArray;
};

//calc start id
const getCurrentKcnaId = async () => {
  const dataModel = new dbModel({ keyToLookup: "kcnaId" }, CONFIG.picCollection);
  const maxId = await dataModel.findMaxId();
  //no id on first lookup
  if (!maxId) return CONFIG.currentId;

  //otherwise calculate it
  const currentKcnaId = Math.max(maxId, CONFIG.currentId);
  return currentKcnaId;
};
