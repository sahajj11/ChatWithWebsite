import axios from "axios";
import { parsePage } from "./parser.service.js";
import { MAX_PAGES, REQUEST_DELAY } from "../utils/constants.js";
import { delay } from "../utils/delay.js";

export const crawlWebsite = async (startUrl) => {
    const queue = [startUrl];
    const visited = new Set();

    const pages = [];

    while (queue.length > 0 && pages.length < MAX_PAGES) {
        const currentUrl = queue.shift();

        if (visited.has(currentUrl)) {
            continue;
        }

        visited.add(currentUrl);

        console.log(`Crawling: ${currentUrl}`);

        try {
            const response = await axios.get(currentUrl, {
                timeout: 10000,
                headers: {
                    "User-Agent": "ChatWithWebsiteBot/1.0",
                },
            });

            const page = parsePage(response.data, currentUrl);

            pages.push({
                url: page.url,
                title: page.title,
                content: page.content,
            });

            for (const link of page.links) {
                if (!visited.has(link)) {
                    queue.push(link);
                }
            }

            await delay(REQUEST_DELAY);
        } catch (err) {
            console.log(`Failed: ${currentUrl}`);
        }
    }

    return pages;
};