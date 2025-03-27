//import mongo
import * as db from "../data/db.js";

class dbModel {
  constructor(dataObject, collection) {
    this.dataObject = dataObject;
    this.collection = collection;
  }

  async storeAny() {
    // await db.dbConnect();
    const storeData = await db.dbGet().collection(this.collection).insertOne(this.dataObject);
    return storeData;
  }

  async storeUniqueURL() {
    // await db.dbConnect();
    await this.urlNewCheck(); //check if new

    const storeData = await this.storeAny();
    return storeData;
  }

  async urlNewCheck() {
    const alreadyStored = await db.dbGet().collection(this.collection).findOne({ url: this.dataObject.url });

    if (alreadyStored) {
      const error = new Error("URL ALREADY STORED");
      error.url = this.dataObject.url;
      error.function = "Store Unique URL";
      throw error;
    }

    //otherwise return trun
    return true;
  }

  async findAny() {
    // await db.dbConnect();
    const arrayData = await db.dbGet().collection(this.collection).find().toArray();
    return arrayData;
  }

  async findNewURLs() {
    // await db.dbConnect();
    //putting collections in dataObject for no reason, if hate self refactor rest of project like this
    const collection1 = this.dataObject.collection1;
    const collection2 = this.dataObject.collection2;
    const distinctURLs = await db.dbGet().collection(collection2).distinct("url");
    const newURLsArray = await db
      .dbGet()
      .collection(collection1)
      .find({ ["url"]: { $nin: distinctURLs } })
      .toArray();
    return newURLsArray;
  }

  async findMaxId() {
    // await db.dbConnect();
    const keyToLookup = this.dataObject.keyToLookup;
    const dataObj = await db
      .dbGet()
      .collection(this.collection)
      .find()
      .sort({ [keyToLookup]: -1 })
      .limit(1)
      .toArray();

    if (!dataObj || !dataObj[0]) return null;

    return +dataObj[0][keyToLookup];
  }

  async getLastItemsArray() {
    const keyToLookup = this.dataObject.keyToLookup;
    const howMany = +this.dataObject.howMany;
    // console.log(howMany);
    const dataArray = await db
      .dbGet()
      .collection(this.collection)
      .find()
      .sort({ [keyToLookup]: -1 })
      .limit(howMany)
      .toArray();

    return dataArray;
  }
}

export default dbModel;
