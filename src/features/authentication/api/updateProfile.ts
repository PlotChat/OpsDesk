import { supabase } from "@/lib/supabase";
import type { UserProfile } from "../types/ProfileType";

export interface updateProfileProps {
	id: UserProfile["id"];
	updates: Partial<Pick<UserProfile, "full_name" | "email" | "role_id">>;
}

export async function updateProfile({ id, updates }: updateProfileProps) {
	const { data, error } = await supabase
		.from("profiles")
		.update(updates)
		.eq("id", id)
		.select("id")
		.maybeSingle();

	if (error) {
		throw new Error("Error updating user profile");
	}
	if (!data) {
		throw new Error(
			"No profile was updated. Check that you have permission to update this profile.",
		);
	}

	return true;
}
