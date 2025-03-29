import CONFIG from "../../config/scrape-config.js";
import dbModel from "../../models/db.js";

//PIC HELPER FUNCTIONS
export const getDateArray = async () => {
  const currentDate = new Date();
  const dateArray = [];

  for (let i = -1; i < 2; i++) {
    const date = new Date(currentDate);

    date.setMonth(currentDate.getMonth() + i);

    // Get month (0-11) and add 1 to get 1-12 range
    const monthRaw = date.getMonth() + 1;

    console.log(monthRaw);

    // Pad month with leading zero if needed
    const month = monthRaw.toString().padStart(2, "0");

    // Get full year
    const year = date.getFullYear();

    // Add month+year string to result array
    dateArray.push(year + "" + month);
  }

  console.log(dateArray);

  return dateArray;
};

//get array of new pics to download  //find dif between pics downloaded and pics posted
export const getPicArray = async (type) => {
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
export const getCurrentKcnaId = async () => {
  const dataModel = new dbModel({ keyToLookup: "kcnaId" }, CONFIG.picCollection);
  const maxId = await dataModel.findMaxId();

  //no id on first lookup
  if (!maxId || CONFIG.currentId > maxId) return CONFIG.currentId;

  //otherwise calculate it
  return maxId;
};
