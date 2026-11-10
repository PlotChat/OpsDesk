import type { User } from "@supabase/supabase-js"

export type UserProfile = {
    id: User["id"];
    email: User["email"];
    role: string;
}