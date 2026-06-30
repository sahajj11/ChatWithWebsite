export const normalizeUrl = (url) => {
    const parsed = new URL(url);

    parsed.hash = "";

    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");

    let normalized = parsed.toString();

    if (normalized.endsWith("/")) {
        normalized = normalized.slice(0, -1);
    }

    return normalized;
};