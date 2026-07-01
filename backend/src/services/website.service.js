import supabase from "../config/supabase.js";

export const createWebsite = async (baseUrl) => {

    const { data, error } = await supabase
        .from("websites")
        .insert({
            base_url: baseUrl,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};