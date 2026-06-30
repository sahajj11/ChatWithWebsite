import { crawlWebsite } from "../services/crawler.service.js";

export const crawl = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required",
            });
        }

        const pages = await crawlWebsite(url);

        return res.json({
            success: true,
            totalPages: pages.length,
            pages,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};