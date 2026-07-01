import supabase from "../config/supabase.js";

export const saveDocument = async (document) => {

    const { error } = await supabase
        .from("documents")
        .insert(document);

    if (error) {
        throw error;
    }
};