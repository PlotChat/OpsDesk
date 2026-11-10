import { supabase } from "@/lib/supabase";
import type { UserProfile } from "../types/ProfileType";

export async function getProfileByUserId({id}: {id: UserProfile["id"]}){
    const {data, error} = await supabase.from("profiles").select("*").eq("id", id).single();

    if(error){
        throw new Error("Error getting profile by user id");
    }

    return data;
}