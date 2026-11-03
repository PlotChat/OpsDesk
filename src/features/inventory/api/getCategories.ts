import { supabase } from "@/lib/supabase";
import type { Category } from "../types/types";

interface GetCategoriesResponse{
	data: Category[],
	count: number | null,
}

export async function getCategories(): Promise<GetCategoriesResponse> {
	const { data, error, count } = await supabase
		.from("categories")
		.select("*", { count: "exact" });

	if (error) {
		throw new Error("Failed fetching categories");
	}

	return { data, count };
}
