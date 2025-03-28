import d from "./define-things.js";
import { parseArticleReturn, parsePicsReturn } from "./parse-return.js";

//HIDE ARRAY
const hideArray = async (inputs) => {
  for (const input of inputs) {
    input.classList.add("hidden");
  }
};

//UNHIDE ARRAY
const unhideArray = async (inputs) => {
  for (const input of inputs) {
    input.classList.remove("hidden");
    // input.classList.remove("#fuck-forms li.hidden");
  }
};

export const runActionButtonDisplay = async (buttonClicked) => {
  //adult way with switch case
  switch (buttonClicked) {
    case d.scrapeKcnaActionButton.id:
      await unhideArray([d.scraperWrapper]);
      break;

    case d.trackCryptoActionButton.id:
      await hideArray([d.scraperWrapper]);
      break;
  }
};

export const runScrapeTypeDisplay = async (buttonClicked) => {
  //hide everything to start
  await hideArray(d.listItemArray);

  console.log("AHHHHHHHHHHH");
  console.dir(d.scrapeTo.value);

  //claude's version with select case
  switch (buttonClicked) {
    case d.restartAuto.id:
      await unhideArray([d.tgIdListItem]);
      break;

    case d.scrapeURL.id:
      await unhideArray([d.urlInputListItem, d.scrapeToListItem]);
      break;

    case d.scrapeBoth.id: //both
    case d.scrapePics.id: //pics
    case d.scrapeArticles.id: //articles
      await unhideArray([d.howManyListItem, d.scrapeToListItem, d.pullNewDataListItem]);
      break;
  }

  //figure out if tg chat ID should be hidden
  if (d.scrapeTo.value === displayTG.id) {
    await unhideArray([d.tgIdListItem]);
  }
};

export const runScrapeToDisplay = async (buttonClicked) => {
  //hide start
  await hideArray([d.tgIdListItem]);

  switch (buttonClicked) {
    case d.displayTG.id: //tgId
      await unhideArray([d.tgIdListItem]);
  }
};

//parses json array
export const displayDataReturn = async (inputData) => {
  const { dataArray, dataType } = inputData;

  //clear previous input
  d.dataReturnElement.innerHTML = "";

  //TO DO: UNFUCK ERROR CHECK
  if (inputData.empty && inputData.empty === "YES") {
    d.dataReturnElement.textContent = "NO DATA STORED, please resubmit and set Scrape New to YES.";
    d.dataReturnWrapper.classList.remove("hidden");
    return;
  }

  if (inputData === null || inputData.length === 0) {
    console.log("RETURN FUCKED");
    d.dataReturnElement.textContent = "DATA RETURN ERROR";
    d.dataReturnWrapper.classList.remove("hidden");
    return;
  }

  //UNFUCK ABOVE

  console.log("DATA DISPLAY");
  console.dir(inputData);

  //change display based on return data
  switch (dataType) {
    //for articles
    case d.scrapeArticles.id:
      await parseArticleReturn(dataArray);
      break;

    //for pics
    case d.scrapePics.id:
      await parsePicsReturn(dataArray);
      break;
  }

  d.dataReturnWrapper.classList.remove("hidden");
  console.log("DATA DISPLAYED");
  return;
};

// d.sectionReturnWrapper.classList.remove("hidden");
// d.dataReturnUpdatesElement.innerHTML = JSON.stringify(data);
// d.makePrettyUpdatesElement.style.display = "block";
