const DEFAULT_CHUNK_SIZE = 1000;      // characters
const DEFAULT_OVERLAP = 200;          // characters

export const chunkContent = (
    text,
    chunkSize = DEFAULT_CHUNK_SIZE,
    overlap = DEFAULT_OVERLAP
) => {

    if (!text || !text.trim()) {
        return [];
    }

    const chunks = [];

    let start = 0;

    while (start < text.length) {

        let end = start + chunkSize;

        if (end < text.length) {

            const lastSpace = text.lastIndexOf(" ", end);

            if (lastSpace > start) {
                end = lastSpace;
            }

        }

        const chunk = text
            .slice(start, end)
            .trim();

        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        start = end - overlap;

        if (start < 0) {
            start = 0;
        }
    }

    return chunks;
};

export const prepareChunks = (page) => {

    const chunks = chunkContent(page.content);

    return chunks.map((chunk, index) => ({
        url: page.url,
        title: page.title,
        chunkIndex: index,
        content: chunk,
    }));
};