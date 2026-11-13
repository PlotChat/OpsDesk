import { supabase } from "@/lib/supabase";
import type { Product } from "../types/types";

export async function editProduct({
	id,
	updates,
}: {
	id: Product["id"];
	updates: Omit<Product, "id" | "created_at">;
}): Promise<boolean> {
	const { sku, name, price, stock_level, categories } = updates;

	{/* Gets the selected product details without the categories */}
	const { error: productError } = await supabase
		.from("products")
		.update({
			name,
			sku,
			price: price === "" ? null : price,
			stock_level: stock_level === "" ? null : stock_level,
		})
		.eq("id", id)
		.single();

	if (productError) {
		throw new Error(`Failed to update product details: ${productError.message}`);
	}

	{/* Deletes the old category values from the junction table */}
	const { error: deleteError } = await supabase
		.from("product_categories")
		.delete()
		.eq("product_id", id);

	if (deleteError) {
		throw new Error(`Failed to clear old categories: ${deleteError.message}`);
	}

	// Insert the new category links (if any were chosen)
	if (categories.length > 0) {
		const insertPayload = categories.map((category) => ({
			product_id: id,
			category_id: category.id,
		}));

		const { error: insertError } = await supabase.from("product_categories").insert(insertPayload);

		if (insertError) {
			throw new Error(`Failed to save new categories: ${insertError.message}`);
		}
	}

	return true;
}
