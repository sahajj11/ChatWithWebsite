import ai from "../config/gemini.js";

export const generateEmbedding = async (text) => {

    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config:{
            outputDimensionality:768
        }
    });

    return response.embeddings[0].values;
};