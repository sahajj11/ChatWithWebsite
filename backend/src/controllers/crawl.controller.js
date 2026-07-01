import { crawlWebsite } from "../services/crawler.service.js";
import { indexDocuments } from "../services/indexing.service.js";

export const crawl = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required",
            });
        }

        const documents = await crawlWebsite(url);

        await indexDocuments(documents);

        return res.json({
            success: true,
            indexed:documents.length
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};