import { supabase } from "@/lib/supabase";

export async function getRoles() {
	const { data, error, count } = await supabase.from("roles").select("*", { count: "exact" });

	if (error) {
		throw new Error("Error fetching user roles");
	}

	if (!data) return null;

	return { data, count };
}
