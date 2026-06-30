import * as cheerio from "cheerio";
import { normalizeUrl } from "../utils/url.js";

export const parsePage = (html, pageUrl) => {
  const $ = cheerio.load(html);

  cleanDocument($);

  const title = $("title").text().trim();

  const content = extractMainContent($);

  const links = extractInternalLinks($, pageUrl);

  return {
    url: pageUrl,
    title,
    content,
    links,
  };
};

const cleanDocument = ($) => {
  $(
    `
        script,
        style,
        noscript,
        svg,
        iframe,
        canvas,
        footer,
        nav,
        aside,
        form,
        button,
        header,
        img,
        video,
        audio,
        advertisement,
        .cookie,
        .cookies,
        .banner,
        .ads,
        .advertisement
        `,
  ).remove();
};

const extractMainContent = ($) => {
  let root = $("main").first() || $("article").first();

  if (!root.length) root = $("#content").first();

  if (!root.length) root = $(".content").first();

  if (!root.length) root = $(".markdown-body").first();

  if (!root.length) root = $("body");

  const paragraphs = [];

  root.find("p, li, h1, h2, h3, h4").each((_, el) => {
    const text = $(el).text().replace(/\s+/g, " ").trim();

    if (text.length > 40) {
      paragraphs.push(text);
    }
  });

  return paragraphs.join("\n\n");
};

const extractInternalLinks = ($, pageUrl) => {
  const links = [];

  const base = new URL(pageUrl);

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");

    if (!href) return;

    try {
      const absolute = new URL(href, pageUrl);

      if (absolute.hostname !== base.hostname) return;

      links.push(normalizeUrl(absolute.href));
    } catch {}
  });

  return [...new Set(links)];
};
