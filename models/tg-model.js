//import mods
import fs from "fs";
import FormData from "form-data";
import axios from "axios";

import tokenArray from "../config/tg-bot.js";

class TgReq {
  constructor(dataObject) {
    this.dataObject = dataObject;
  }

  //SEND TG GET
  async tgGet(tokenIndex) {
    const token = tokenArray[tokenIndex];
    const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${this.dataObject.offset}`;

    //send data
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  //SEND TG POST
  async tgPost(command, tokenIndex) {
    const token = tokenArray[tokenIndex];
    const url = `https://api.telegram.org/bot${token}/${command}`;

    //send data
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(this.dataObject),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  // SEND UPLOAD PIC
  async tgPicFS(tokenIndex) {
    const token = tokenArray[tokenIndex];
    const url = `https://api.telegram.org/bot${token}/sendPhoto`;
    //build form
    const form = new FormData();
    form.append("chat_id", this.dataObject.chatId), form.append("photo", fs.createReadStream(this.dataObject.picPath));

    //upload Pic
    try {
      const response = await axios.post(url, form, {
        headers: form.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.log("UPLOAD FUCKED");
      if (error && error.response && error.response.data) {
        console.log(error.response.data);
        return error.response.data;
      } else {
        return error;
      }
    }
  }
}

export default TgReq;
