import axios from "axios";
import robotsParser from "robots-parser";

const robotsCache = new Map();

export const canCrawl = async (url) => {
    try {
        const parsedUrl = new URL(url);

        const robotsUrl = `${parsedUrl.origin}/robots.txt`;

        let robots = robotsCache.get(robotsUrl);

        if (!robots) {
            const { data } = await axios.get(robotsUrl, {
                timeout: 5000,
            });

            robots = robotsParser(robotsUrl, data);

            robotsCache.set(robotsUrl, robots);
        }

        return robots.isAllowed(url, "ChatWithWebsiteBot");
    } catch (err) {
        // If robots.txt doesn't exist,
        // allow crawling.
        return true;
    }
};