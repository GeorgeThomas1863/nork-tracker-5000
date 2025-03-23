//import modules
import d from "./define-things.js";

export const buildInputParams = async () => {
  const params = {
    route: "/scrape-submit-route",
    scrapeType: d.scrapeType.value,
    scrapeTo: d.scrapeTo.value,
    urlInput: d.urlInput.value,
    howMany: d.howMany.value,
    tgId: d.tgId.value,
    pullNewData: d.pullNewData.value,
  };
  return params;
};

export const sendToBack = async (inputParams) => {
  console.log(inputParams);
  const route = inputParams.route;
  //send all to backend
  try {
    const res = await fetch(route, {
      method: "POST",
      body: JSON.stringify(inputParams),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
