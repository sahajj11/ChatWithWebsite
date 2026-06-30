import { Router } from "express";
import { crawlWebsite } from "../controllers/crawl.controller.js";


const router = Router();

router.post("/", crawlWebsite);

export default router;