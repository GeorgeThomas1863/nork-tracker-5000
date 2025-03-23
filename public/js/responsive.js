//import modules
import d from "./define-things.js";
import { runActionButtonDisplay, runScrapeTypeDisplay, runScrapeToDisplay, displayDataReturn } from "./display.js";
import { buildInputParams, sendToBack } from "./submit.js";

const changeDisplay = async (e) => {
  e.preventDefault();
  const eventElement = e.target;
  const buttonClickedId = eventElement.id;
  const buttonClickedValue = eventElement.value;

  //execute function based on event trigger
  switch (eventElement.id) {
    case d.scrapeKcnaActionButton.id:
    case d.trackCryptoActionButton.id:
      await runActionButtonDisplay(buttonClickedId);
      break;

    case d.scrapeType.id:
      await runScrapeTypeDisplay(buttonClickedValue);
      break;

    case d.scrapeTo.id:
      await runScrapeToDisplay(buttonClickedValue);
      break;
  }
};

const scrapeSubmit = async (e) => {
  e.preventDefault();

  //get input params
  const inputParams = await buildInputParams();

  //get data
  const data = await sendToBack(inputParams);
  console.log(data);

  //display data
  await displayDataReturn(data);
};

//action button display
d.scrapeKcnaActionButton.addEventListener("click", changeDisplay);
d.trackCryptoActionButton.addEventListener("click", changeDisplay);

//drop down click listeners
d.scrapeTypeListItem.addEventListener("click", changeDisplay);
d.scrapeToListItem.addEventListener("click", changeDisplay);

//submit event listener
d.submitButton.addEventListener("click", scrapeSubmit);
