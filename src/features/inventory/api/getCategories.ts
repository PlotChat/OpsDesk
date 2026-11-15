import { supabase } from "@/lib/supabase";
import type { Category, RevenueCategory } from "../types/types";

interface GetCategoriesResponse {
	data: Category[];
	count: number | null;
}

export async function getCategories(): Promise<GetCategoriesResponse> {
	const { data, error, count } = await supabase.from("categories").select("*", { count: "exact" });

	if (error) {
		throw new Error("Failed fetching categories");
	}

	return { data, count };
}

export interface getRevenueByCategoryProps {
	daysBack: number;
}

export async function getRevenueByCategory({ daysBack }: getRevenueByCategoryProps) {
	const { data, error } = await supabase.rpc("get_revenue_by_category", { days_back: daysBack });

	if (error) {
		throw new Error("Error fetching get revenue by categories");
	}

	if (!data) return [];

	return data as RevenueCategory[];
}
