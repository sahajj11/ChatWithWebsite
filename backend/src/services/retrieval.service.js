import supabase from "../config/supabase.js";
import { generateEmbedding } from "./embedding.service.js";

export const retrieveRelevantChunks = async (
    
    question,
    limit = 5
) => {

    const embedding = await generateEmbedding(question);

    const { data, error } = await supabase.rpc(
    "match_documents",
    {
        query_embedding: embedding,
        
        match_count: 5,
    }
);

    if (error) {
        throw error;
    }

    return data;
};