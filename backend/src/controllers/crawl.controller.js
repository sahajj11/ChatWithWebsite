import { crawlPage } from "../services/crawler.service.js";

export const crawlWebsite = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required",
            });
        }

        const result = await crawlPage(url);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};