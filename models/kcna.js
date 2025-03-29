import axios from "axios";
import fs from "fs";
import fsPromises from "fs/promises";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

//set default file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class KCNA {
  constructor(dataObject) {
    this.dataObject = dataObject;
  }

  async getHTML() {
    try {
      const res = await fetch(this.dataObject.url);
      // console.log(res);
      const data = await res.text();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async saveHTMLFS(inputData) {
    const filePath = join(__dirname, "../data", this.dataObject.fileName);
    await fsPromises.writeFile(filePath, inputData);
    const fileSize = await this.getFileSizeFS(filePath); //ensure data saved
    return fileSize;
  }

  async getFileSizeFS(filePath) {
    try {
      const fileData = await fsPromises.stat(filePath);
      return fileData.size;
    } catch (e) {
      console.log(e.message);
      return 0;
    }
  }

  async getDataType() {
    try {
      const data = await fetch(this.dataObject.url);
      if (!data || !data.headers) return null;
      const dataType = data.headers.get("content-type");
      return dataType;
    } catch (error) {
      console.log(error);
    }
  }

  async downloadPicFS() {
    const picURL = this.dataObject.url;
    const savePath = this.dataObject.savePath;

    try {
      const res = await axios.get(picURL, {
        responseType: "stream",
        // timeout: 5000,
      });

      const writer = fs.createWriteStream(savePath);
      const stream = res.data.pipe(writer);
      const totalSize = parseInt(res.headers["content-length"], 10);      
      let downloadedSize = 0;

      console.log("DOWNLOADING PIC " + totalSize + "B")
      console.log(totalSize)

      //download shit
      res.data.on("data", (chunk) => {
        downloadedSize += chunk.length;
        if (downloadedSize >= totalSize) {
          // console.log("All data chunks downloaded.");
          // console.log(picURL);
        }
      });

      await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
      });

      return picURL;
    } catch (error) {
      //dont think error needed here

      error.url = picURL;
      error.function = "downloadPicFS";
      throw error;
    }
  }
}

export default KCNA;
