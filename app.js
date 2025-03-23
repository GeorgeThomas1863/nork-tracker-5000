//ON: SCRAPE COMMANDS

//TO DO:
//
//1. make sure all collections in KCNA2 are updated (might have to uplaod a few more pics)
//1. get everything working
//1. display current pics / articles on main page
//1. way to update pics / articles / get new/

import { dirname, join } from "path";
import { fileURLToPath } from "url";

import express from "express";
import routes from "./routes/kcna-routes.js";

import CONFIG from "./config/scrape-config.js";
import * as db from "./data/db.js";

//set default file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("views", join(__dirname, "html"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//have express render custom location of saved pics
app.use("/kcna-pics", express.static(CONFIG.savePicPathBase));

app.use(routes);

db.dbConnect().then(() => {
  //port to listen  //1862

  app.listen(1896);
});
