import { generateEmbedding } from "./embedding.service.js";
import { saveDocument } from "./database.service.js";

export const indexDocuments = async (documents) => {
    for (const document of documents) {
        const embedding = await generateEmbedding(document.content);

console.log(embedding.length);

        await saveDocument({
            url: document.url,
            title: document.title,
            chunk_index: document.chunkIndex, // ✅ Match DB column name
            content: document.content,
            embedding,
        });
    }
};