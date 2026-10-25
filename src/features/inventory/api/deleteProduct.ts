import { supabase } from "@/lib/supabase";
import type { Product } from "./getProducts";

export async function deleteProduct({
	id
}: {
	id: string;
}): Promise<Product> {
	const { data, error } = await supabase
		.from("products")
		.delete()
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw new Error("Failed to delete the product");
	}

	return data;
}