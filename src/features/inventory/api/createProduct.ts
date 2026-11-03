import { supabase } from "@/lib/supabase";
import type { Category } from "../types/types";

export interface CreateProductInput {
	name: string;
	sku: string;
	price: number;
	stock_level: number;
	categories?: Category[];
}

export async function createProduct({
	categories,
	...productData
}: CreateProductInput) {
	const { data: product, error: productError } = await supabase
		.from("products")
		.insert(productData)
		.select()
		.single();

	if (productError) {
		throw new Error(`Cannot create product "${productData.name}"`);
	}

	if (categories && categories.length > 0) {
        const junctionData = categories.map((c) => ({
            product_id: product.id,
            category_id: c.id,
        }));

        const { error: junctionError } = await supabase
            .from("product_categories")
            .insert(junctionData);

        if (junctionError) console.error("Failed to link categories:", junctionError);
    }

	return product;
}
