import axios from "axios";
import { parsePage } from "./parser.service.js";
import { MAX_PAGES, REQUEST_DELAY } from "../utils/constants.js";
import { delay } from "../utils/delay.js";
import { canCrawl } from "./robots.service.js";
import { normalizeUrl } from "../utils/url.js";
import { chunkContent } from "./chunk.service.js";
import { prepareChunks } from "./chunk.service.js";

export const crawlWebsite = async (startUrl) => {
    const queue = [normalizeUrl(startUrl)];
    const visited = new Set();

    const documents = [];

    while (queue.length > 0 && documents.length < MAX_PAGES) {
        const currentUrl = queue.shift();

        if (visited.has(currentUrl)) {
            continue;
        }

        visited.add(currentUrl);

        const allowed=await canCrawl(currentUrl)

        if(!allowed){
            console.log(`Blocked by robots.txt: ${currentUrl}`)
            continue
        }

        console.log(`Crawling: ${currentUrl}`);

        try {
            const response = await axios.get(currentUrl, {
                timeout: 10000,
                headers: {
                    "User-Agent": "ChatWithWebsiteBot/1.0",
                },
            });

            const page = parsePage(response.data, currentUrl);

            const preparedChunks = prepareChunks(page);

            documents.push(...preparedChunks)

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

    return documents;
};