//putting everything inside an obj =

const d = {
  //action buttons
  scrapeKcnaActionButton: document.getElementById("scrape-kcna-action-button"),
  trackCryptoActionButton: document.getElementById("track-crypto-action-button"),

  //wrapper
  scraperWrapper: document.getElementById("scraper-wrapper"),

  //list items
  scrapeTypeListItem: document.getElementById("scrapeType-list-item"),
  pullNewDataListItem: document.getElementById("newData-list-item"),
  urlInputListItem: document.getElementById("urlInput-list-item"),
  howManyListItem: document.getElementById("howMany-list-item"),
  scrapeToListItem: document.getElementById("scrapeTo-list-item"),
  tgIdListItem: document.getElementById("tgId-list-item"),

  //drop down IS FUCKED USE: scrapeBoth: document.getElementById("scrapeType")[0].value to select
  //ANSWER: had forgot to assign id's to the drop down options (just had the fucking values defined)
  scrapeType: document.getElementById("scrapeType"),
  scrapeBoth: document.getElementById("scrapeBoth"),
  scrapePics: document.getElementById("scrapePics"),
  scrapeArticles: document.getElementById("scrapeArticles"),
  scrapeURL: document.getElementById("scrapeURL"),
  restartAuto: document.getElementById("restartAuto"),

  //referencing VIA drop down is fucked; use select element
  scrapeTo: document.getElementById("scrapeTo"),
  displayHere: document.getElementById("displayHere"),
  displayTG: document.getElementById("displayTG"),

  pullNewData: document.getElementById("pullNewData"),
  noNewData: document.getElementById("noNewData"),
  yesNewData: document.getElementById("yesNewData"),

  //inputs
  urlInput: document.getElementById("urlInput"),
  howMany: document.getElementById("howMany"),
  tgId: document.getElementById("tgId"),

  //submit button
  submitButton: document.getElementById("submit-button"),

  //define return display and make pretty elements
  dataReturnWrapper: document.getElementById("data-return-wrapper"),
  dataReturnElement: document.getElementById("data-return-element"),
  // makePrettyUpdatesElement: document.getElementById("make-pretty-button"),
  // undoButtonElement: document.getElementById("undo-button"),
};

//add in array
d.listItemArray = [d.urlInputListItem, d.pullNewDataListItem, d.howManyListItem, d.scrapeToListItem, d.tgIdListItem];

export default d;
