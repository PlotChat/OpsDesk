import type { User } from "@supabase/supabase-js"

export type UserProfile = {
    id: User["id"];
    full_name: string;
    email: User["email"];
    role: "admin" | "staff" | "customer";
}