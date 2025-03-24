import d from "./define-things.js";

export const parseArticleReturn = async (inputData) => {
  // Create a container for all articles
  const articleList = document.createElement("ul");
  articleList.className = "article-list";

  //loop through return array
  for (const article of inputData) {
    const listItem = document.createElement("li");
    listItem.className = "article-list-item";

    // Create article element
    const articleElement = document.createElement("article");
    articleElement.className = "article-item";

    // Create and append title
    const titleElement = document.createElement("h2");
    titleElement.className = "article-title";
    titleElement.textContent = article.title;
    articleElement.appendChild(titleElement);

    // Format and append date
    const dateElement = document.createElement("div");
    dateElement.className = "article-date";
    // Format date nicely
    const dateObj = new Date(article.date);
    dateElement.textContent = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    articleElement.appendChild(dateElement);

    // Create and append content
    const contentElement = document.createElement("div");
    contentElement.className = "article-content";

    // Fix line breaks by replacing \n with <br> tags
    const contentWithBreaks = article.content.replace(/\n/g, "<br>");

    // Use innerHTML for content since it might contain HTML
    contentElement.innerHTML = contentWithBreaks;
    articleElement.appendChild(contentElement);

    // Add the article to the list item
    listItem.appendChild(articleElement);
    articleList.appendChild(listItem);
  }

  // Clear previous content if any
  if (d.dataReturnElement.firstChild) {
    d.dataReturnElement.innerHTML = "";
  }

  // Add all articles to the return element
  d.dataReturnElement.appendChild(articleList);
};

export const parsePicsReturn = async (inputData) => {
  const picList = document.createElement("ul");
  picList.className = "pic-list";

  console.log("INPUT DATA");
  console.dir(inputData);

  //loop through return array of OBJECTS
  for (const pic of inputData) {
    //extract url for pic
    const fileNameRaw = pic.picPath;
    const fileName = fileNameRaw.split("/").pop();
    const picPath = "/kcna-pics/" + fileName;

    console.log("PIC PATH");
    console.log(picPath);

    const picItem = document.createElement("li");
    picItem.className = "pic-list-item";

    // Create pic element
    const picElement = document.createElement("img");
    picElement.src = picPath;
    picElement.className = "pic-item";

    picItem.appendChild(picElement);
    picList.appendChild(picItem);
  }

  // Clear previous content if any
  if (d.dataReturnElement.firstChild) {
    d.dataReturnElement.innerHTML = "";
  }

  // Add all articles to the return element
  d.dataReturnElement.appendChild(picList);
};
