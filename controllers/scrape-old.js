import { getArticlesAuto } from "./articles/articles-get.js";
import { postArticlesAuto } from "./articles/articles-post.js";
import { scrapePicsAuto } from "./pics/pics-main.js";

import { logArticleLookup, storeArticleArray, storeArticleObj } from "./articles/articles-store.js";
// const scrapeHourly = async (scrapeFunction) => {
//   scrapeFunction();

//   // Calculate time until the next hour
//   const now = new Date();
//   const nextHour = new Date(now);
//   nextHour.setHours(now.getHours() + 1);
//   nextHour.setMinutes(0);
//   nextHour.setSeconds(0);
//   nextHour.setMilliseconds(0);

//   const timeUntilNextHour = nextHour - now;

//   // Schedule the first task at the start of the next hour
//   setTimeout(() => {
//     scrapeFunction(); // Execute the task

//     // Then set up an interval to run every hour (3600000 ms = 1 hour)
//     setInterval(scrapeFunction, 3600000);
//   }, timeUntilNextHour);

//   console.log(`Scheduler initialized. Next execution scheduled at: ${nextHour.toISOString()}`);
// };

//Function being executed
export const scrapeKCNA = async () => {
  await getArticlesAuto();
  await postArticlesAuto();
  await scrapePicsAuto();
  console.log("FINISHED SCRAPE");
};

// //PASS IN FUNCTION AS PARAM TO EXECUTE HOURLY
// scrapeHourly(scrapeKCNA);

//---------------------
