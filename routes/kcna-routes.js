import express from "express";

import { indexDisplay, display404, display500 } from "../controllers/display.js";
import { parseCommand } from "../controllers/scrape-parse.js";

const router = express.Router();

//tg command sumbit
router.post("/scrape-submit-route", parseCommand);

//tg display route
router.get("/", indexDisplay);

router.use(display404);

router.use(display500);

export default router;
