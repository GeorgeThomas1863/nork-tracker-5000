import { JSDOM } from "jsdom";

import CONFIG from "../config/scrape-config.js";
import KCNA from "../models/kcna.js";
import dbModel from "../models/db.js";

export const scrapeArticles = async () => {
  //get the articles currently on site
  const articleListHtml = await getArticleListHtml();
  await logArticleLookup(articleListHtml); //log lookups can turn fof
  const articlesArray = await parseArticleList(articleListHtml);
  if (articlesArray.length === 0) return null; //no new articles

  //otherwise store articles and get article data; DEFAULT keep logging on
  const storeData = await storeArticleArray(articlesArray);
  // console.log(storeData);
  const articleData = await getArticleData(articlesArray);
  // console.log(articleData);

  return articlesArray;
};

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

export const parseArticleList = async (inputData) => {
  const articleArray = [];
  // Parse the HTML using JSDOM
  const dom = new JSDOM(inputData);
  const document = dom.window.document;

  // Find the element with class "article-link"
  const articleLinkElement = document.querySelector(".article-link");

  // If the element doesn't exist, return an empty array
  if (!articleLinkElement) {
    console.log('No element with class "article-link" found.');
    return [];
  }

  // Find all anchor tags within the article-link element
  const linkElements = articleLinkElement.querySelectorAll("a");
  const urlConstant = "http://www.kcna.kp";

  // Use a for loop to extract the href values
  for (let i = 0; i < linkElements.length; i++) {
    const href = linkElements[i].getAttribute("href");

    //check if new (prob NOT necessary here)
    try {
      const urlObj = {}; //reset obj
      const myId = await getMyId(i);
      urlObj.url = urlConstant + href;
      urlObj.myId = myId;

      const dataModel = new dbModel(urlObj, CONFIG.articleListCollection);
      await dataModel.urlNewCheck(); //will throw error if not unique

      //otherwise add to array
      articleArray.push(urlObj);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
      continue; //if error move on to next link
    }
  }

  return articleArray;
};

export const storeArticleArray = async (inputArray) => {
  for (let i = 0; i < inputArray.length; i++) {
    //should all be unique, no need for try catch
    const urlObj = inputArray[i];
    const storeModel = new dbModel(urlObj, CONFIG.articleListCollection);
    const storeURL = await storeModel.storeUniqueURL();
    console.log(storeURL);
  }
};

export const getArticleData = async (inputArray) => {
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

      const storeArticle = await storeArticleObj(articleObj);
      console.log(storeArticle);
    } catch (e) {
      console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
      continue; //if error move on to next link
    }
  }
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

export const parseArticleHtml = async (inputHtml) => {
  const dom = new JSDOM(inputHtml);
  const document = dom.window.document;

  // Extract the title - KCNA uses article-main-title class
  const titleElement = document.querySelector(".article-main-title");
  const articleTitle = titleElement.textContent.replace(/\s+/g, " ").trim();

  //extract date
  const dateElement = document.querySelector(".publish-time");
  const dateRaw = dateElement.textContent.replace('www.kcna.kp ', '').replace(/[\(\)]/g, '').trim(); //prettier-ignore
  const year = parseInt(dateRaw.substring(0, 4));
  const month = parseInt(dateRaw.substring(5, 7));
  const day = parseInt(dateRaw.substring(8, 10));

  // Validate the date
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    const error = new Error("DATE FUCKED");
    error.url = articleTitle; //dont care
    error.function = "parseArticleHTML";
    throw error;
  }

  // Create a new Date object (month is 0-indexed in JavaScript)
  const articleDate = new Date(year, month - 1, day);

  let articleContent = "";
  const contentElement = document.querySelector(".content-wrapper");
  const paragraphs = contentElement.querySelectorAll("p");

  // Use a traditional for loop instead of map
  let paragraphArray = [];
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphArray.push(paragraphs[i].textContent.trim());
  }

  // Join paragraphs with double newlines for better readability
  articleContent = paragraphArray.join("\n\n");

  const articleObj = {
    title: articleTitle,
    date: articleDate,
    content: articleContent,
  };

  return articleObj;
};

export const storeArticleObj = async (inputData) => {
  try {
    const storeModel = new dbModel(inputData, CONFIG.articleContentCollection);
    const storeData = await storeModel.storeUniqueURL();
    return storeData;
  } catch (e) {
    console.log(e.url + "; " + e.message + "; F BREAK: " + e.function);
  }
};

//LOG article lookups //CAN TURN OFF
export const logArticleLookup = async (articleListHtml) => {
  //pull first 50 characters just to ensure working
  const sampleHtml = articleListHtml.trim().substring(50, 200);
  const dateTime = new Date().toISOString();

  //store params
  const params = {
    html: sampleHtml,
    dateTime: dateTime,
  };

  //store data
  const storeModel = new dbModel(params, CONFIG.articleLogCollection);
  await storeModel.storeAny();
};

//(for when collection is blank / always pull latest)
const getMyId = async (inputId) => {
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
