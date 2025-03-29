import CONFIG from "../../config/scrape-config.js";
import KCNA from "../../models/kcna.js";
import dbModel from "../../models/db.js";

import { getPicArray, getDateArray, getCurrentKcnaId } from "./pics-util.js";
import { uploadPicsTG, editCaptionTG } from "../tg-api.js";

export const scrapePicsAuto = async () => {
  console.log("DOWNLOADING NEW PICS");

  const newPicUrls = await getPicURLs();
  console.log(newPicUrls);

  //GET PIC ARRAY for downloading here (specifying type in arg)
  const downloadPicArray = await getPicArray("picsToDownload");
  // console.log(downloadPicArray);

  console.log("DOWNLOADING PICS");

  //run download pics
  await downloadPicsFS(downloadPicArray);

  console.log("UPLOADING PICS");

  //get pic array for uploading here
  const uploadPicArray = await getPicArray("picsToUpload");

  //build upload obj
  const uploadObj = {
    picArray: uploadPicArray,
    postToId: CONFIG.articleSendToId,
  };

  console.log(uploadObj);

  //run upload pics
  await uploadPicsFS(uploadObj);

  console.log("FINISHED UPLOADING PICS")

  return newPicUrls;
};

export const getPicURLs = async () => {
  //get date array
  const dateArray = await getDateArray();
  const currentKcnaId = await getCurrentKcnaId();

  // console.log("HERE CURRENT KCNA ID");
  // console.log(currentKcnaId);

  //loop 200 (400 lookups an hour)
  const startId = currentKcnaId - 100;
  const stopId = currentKcnaId + 100;

  let arrayIndex = 0;

  //loop
  for (let i = startId; i <= stopId; i++) {
    // console.log(i);
    for (let k = 0; k < dateArray.length; k++) {
      try {
        const dateString = dateArray[arrayIndex];
        const url = CONFIG.picBaseURL + dateString + "/PIC00" + i + ".jpg";
        // console.log(url);
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
        //store it
        const picPath = CONFIG.savePicPathBase + i + ".jpg";
        const storeParams = {
          url: url,
          kcnaId: i,
          dateString: dateString,
          picPath: picPath,
        };

        const dataModel = new dbModel(storeParams, CONFIG.picCollection);
        const storePicData = await dataModel.storeUniqueURL();
        // console.log(storeParams);
        // console.log(storePicData);
        break;
      } catch (e) {
        console.log(e.message + "; URL: " + e.url + "; BREAK: " + e.function);
        break;
      }
    }
  }
  return true;
};

//ACCEPTS ARRAY OF OBJECTS
export const downloadPicsFS = async (picArray) => {
  //loop
  for (let i = 0; i < picArray.length; i++) {
    try {
      const pic = picArray[i];

      const downloadPicParams = {
        url: pic.url,
        savePath: pic.picPath,
      };

      console.log(downloadPicParams);

      //download pic
      const downloadPicModel = new KCNA(downloadPicParams);
      const downloadPicData = await downloadPicModel.downloadPicFS();
      console.log(downloadPicData);

      //store pic was downloaded
      const storePicModel = new dbModel(pic, CONFIG.downloadedCollection);
      const storePicDownloaded = await storePicModel.storeUniqueURL();
      // console.log(storePicDownloaded);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
    }
  }
};

export const uploadPicsFS = async (uploadObj) => {
  const { picArray, postToId } = uploadObj;

  for (let i = 0; i < picArray.length; i++) {
    try {
      const pic = picArray[i];
      const params = {
        chatId: postToId,
        picPath: pic.picPath,
      };

      console.log(params);

      //upload pic
      const uploadPicData = await uploadPicsTG(params);
      // console.log(uploadPicData)

      //edit caption
      const defangURL = pic.url.replace(/\./g, "[.]").replace(/:/g, "[:]");
      const normalURL = defangURL.substring(15);
      const caption = "ID: " + pic.kcnaId + "; URL: " + normalURL;
      const editCaptionData = await editCaptionTG(uploadPicData, caption);
      // console.log(editCaptionData);

      //store pic was uploaded
      const storePicModel = new dbModel(pic, CONFIG.uploadedCollection);
      const storePicDownloaded = await storePicModel.storeUniqueURL();
      // console.log(storePicDownloaded);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
    }
  }
};
