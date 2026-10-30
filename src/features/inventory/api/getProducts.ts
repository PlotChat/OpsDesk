import { supabase } from "@/lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Product } from "../types/types";

export interface ProductPagesResponse {
	data: Product[];
	totalPages: number | null;
	count: number | null;
	error: PostgrestError | null;
}

export interface ProductPagesProps {
	page: number;
	pageSize: number;
}

export async function getProductsPage({
	page,
	pageSize,
}: ProductPagesProps): Promise<ProductPagesResponse> {
	const from = (page - 1) * pageSize;
	const to = page * pageSize - 1;

	const { data, error, count } = await supabase
		.from("products")
		.select("*", { count: "exact" })
		.order("created_at", { ascending: false })
		.range(from, to);

	if (error) {
		throw new Error("Failed fetching products");
	}

	const totalPages = count !== null ? Math.ceil(count / pageSize) : null;

	return { data, error, count, totalPages };
}

export async function getProduct({ id }: { id: string }): Promise<Product> {
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error("Failed fetching this product");
	}

	return data;
}
