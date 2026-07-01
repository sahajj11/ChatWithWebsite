import { Router } from "express";
import { retrieveRelevantChunks } from "../services/retrieval.service.js";

const router = Router();

router.post("/", async (req, res) => {

    const { question } = req.body;

    const chunks = await retrieveRelevantChunks(question);

    res.json(chunks);

});

export default router;