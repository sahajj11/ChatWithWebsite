import { retrieveRelevantChunks } from "./retrieval.service.js";
import { generateEmbedding } from "./embedding.service.js";
import ai from "../config/gemini.js";

const buildContext = (chunks) => {
  return chunks
    .map((c, i) => {
      return `
SOURCE ${i + 1}
URL: ${c.url}
TITLE: ${c.title}
CONTENT: ${c.content}
`;
    })
    .join("\n");
};

const buildPrompt = (question, context) => {
  return `
You are ChatWithWebsite, a RAG-based AI assistant.

RULES:
- Use ONLY the provided sources.
- If answer is not in sources, say "Not found in the website data."
- Always cite sources like [1], [2].

SOURCES:
${context}

QUESTION:
${question}

ANSWER:
`;
};

export const chatService = {
  async chat(message) {
    // 1. retrieve relevant chunks (already embeds inside)
    const chunks = await retrieveRelevantChunks(message, 5);

    // 2. build context
    const context = buildContext(chunks);

    // 3. build prompt
    const prompt = buildPrompt(message, context);

    // 4. call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const answer = response.text;

    // 5. return structured response
    return {
      answer,
      sources: chunks.map((c, i) => ({
        id: i + 1,
        url: c.url,
        title: c.title,
      })),
    };
  },
};