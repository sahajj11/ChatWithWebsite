import * as cheerio from "cheerio";

export const parsePage = (html, pageUrl) => {
    const $ = cheerio.load(html);

    const title = $("title").text().trim();

    const content = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();

    const links = extractInternalLinks($, pageUrl);

    return {
        url: pageUrl,
        title,
        content,
        links,
    };
};

const extractInternalLinks = ($, pageUrl) => {
    const links = [];
    const base = new URL(pageUrl);

    $("a[href]").each((_, element) => {
        const href = $(element).attr("href");

        if (!href) return;

        try {
            const absoluteUrl = new URL(href, pageUrl).href;
            const current = new URL(absoluteUrl);

            if (current.hostname === base.hostname) {
                links.push(absoluteUrl);
            }
        } catch (err) {
            // Ignore invalid URLs
        }
    });

    return [...new Set(links)];
};