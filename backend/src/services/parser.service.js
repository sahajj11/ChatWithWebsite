import * as cheerio from "cheerio";

export const parsePage = (html, pageUrl) => {
    const $ = cheerio.load(html);

    $("script").remove();
    $("style").remove();
    $("noscript").remove();

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
            const absolute = new URL(href, pageUrl);

            if (absolute.hostname === base.hostname) {
                absolute.hash = "";

                links.push(absolute.href);
            }
        } catch {}
    });

    return [...new Set(links)];
};