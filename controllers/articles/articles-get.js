import { JSDOM } from "jsdom";

import CONFIG from "../../config/scrape-config.js";
import KCNA from "../../models/kcna.js";
import dbModel from "../../models/db.js";

import { parseArticleHtml, parseArticleList } from "./articles-parse.js";
import { logArticleLookup, storeArticleArray, storeArticleObj } from "./articles-store.js";
import { downloadPicsFS } from "../pics/pics-main.js";

//MAIN auto function for scraping articles
export const getArticlesAuto = async () => {
  //get the articles currently on site
  const articleListHtml = await getArticleListHtml();

  //log lookups can turn fof
  await logArticleLookup(articleListHtml);

  //parse out an array of articles
  const articleArray = await parseArticleList(articleListHtml);

  console.log("AHHHHHHHHHHHHH")
  console.log(articleArray)

  //no new articles
  if (articleArray.length === 0) return null;

  //otherwise store articles and get article data
  await storeArticleArray(articleArray);
  // console.log(storeData);

  //get data for each article by looping through array
  const articleDataArray = await getArticleData(articleArray);

  // console.log(articleData);
  const storeArticle = await storeArticleObj(articleDataArray);
  console.log(storeArticle);

  return articleArray;
};

//Gets HTML for main page that has list of articles
export const getArticleListHtml = async () => {
  const articleListObj = {
    url: CONFIG.articleListURL,
    fileName: "articleList.html",
  };

  //get article list
  const articleListModel = new KCNA(articleListObj);
  const articleListHtml = await articleListModel.getHTML();

  return articleListHtml;
};

//returns ARRAY of objs
export const getArticleData = async (inputArray) => {
  //return an array
  const articleObjArray = [];
  for (let i = 0; i < inputArray.length; i++) {
    try {
      //check article data isnt already saved
      const inputObj = inputArray[i];
      const dataModel = new dbModel(inputObj, CONFIG.articleContentCollection);
      await dataModel.urlNewCheck(); //will throw error if not new

      //if new get article html
      const article = inputArray[i].url;
      const articleHtml = await getArticleHtml(article);
      // console.log(articleHtml);
      const articleObj = await parseArticleHtml(articleHtml);
      articleObj.url = article; //add url to object
      articleObj.myId = inputObj.myId; //add myId to article Obj

      //LOOK FOR FUCKING PICS HERE
      if (articleObj && articleObj.picURL) {
        const articlePicArray = await getArticlePics(articleObj.picURL);
        articleObj.articlePicArray = articlePicArray;
      }

      //add obj to array
      articleObjArray.push(articleObj);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
      continue; //if error move on to next link
    }
  }

  return articleObjArray; //return the ARRAY dumbfuck
};

export const getArticleHtml = async (url) => {
  const articleHtmlObj = {
    url: url,
    fileName: "article.html",
  };

  const articleModel = new KCNA(articleHtmlObj);
  const articleHtml = await articleModel.getHTML();

  return articleHtml;
};

//(for when collection is blank / always pull latest)
export const getMyId = async (inputId) => {
  const dataModel = new dbModel({ keyToLookup: "myId" }, CONFIG.articleContentCollection);
  const myIdStored = dataModel.findMaxId();

  //if doesnt exists
  if (!myIdStored || inputId > myIdStored) return inputId;

  if (myIdStored > inputId) {
    return myIdStored + 1;
  }

  //if equal just return input
  return inputId;
};

export const getArticlePics = async (picURL) => {
  //get html for link to pics
  const picHtml = await getArticleHtml(picURL);

  const dom = new JSDOM(picHtml);
  const document = dom.window.document;

  const imgElements = document.querySelectorAll("img");
  const articlePicArray = [];

  // Use a for loop to extract the src attributes
  for (let i = 0; i < imgElements.length; i++) {
    const imgSrc = imgElements[i].getAttribute("src");
    if (imgSrc) {
      //extract out final number for pic file name
      const picPathNum = imgSrc.substring(imgSrc.length - 11, imgSrc.length - 4);
      const picPathEnd = String(Number(picPathNum));

      const picObj = {
        url: "http://www.kcna.kp" + imgSrc,
        picPath: CONFIG.savePicPathBase + picPathEnd + ".jpg",
      };

      articlePicArray.push(picObj);
    }
  }

  //download pics (if they havent been already)
  await downloadPicsFS(articlePicArray);

  return articlePicArray;
};
