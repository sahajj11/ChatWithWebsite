import axios from "axios";
import { parsePage } from "./parser.service.js";

export const crawlPage = async (url) => {
    const response = await axios.get(url, {
        timeout: 10000,
        headers: {
            "User-Agent": "ChatWithWebsiteBot/1.0",
        },
    });

    return parsePage(response.data, url);
};