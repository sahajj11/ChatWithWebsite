import { Router } from "express";
import { crawl } from "../controllers/crawl.controller.js";



const router = Router();

router.post("/", crawl);

export default router;