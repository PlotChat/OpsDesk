import type { User } from "@supabase/supabase-js";

export type UserProfileRole = {
	id: string;
	name: "admin" | "staff" | "customer";
};

export type RawUserProfile = {
	id: User["id"];
	full_name: string;
	email: User["email"];
	role_id: UserProfileRole["id"];
	roles: { id: UserProfileRole["id"]; name: UserProfileRole["name"] } | null;
	created_at: string;
};

export type UserProfile = {
	id: User["id"];
	full_name: string;
	email: User["email"];
	role_id: UserProfileRole["id"];
	role_name: UserProfileRole["name"];
	created_at: string;
};

export type UserProfileFilterType = {
	roles: UserProfileRole["name"][] | [];
};
