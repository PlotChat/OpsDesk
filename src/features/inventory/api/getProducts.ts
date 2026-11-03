import { supabase } from "@/lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Category, Product, ProductCategoryJunction, RawProduct } from "../types/types";
import { formatTimeToDMY } from "@/lib/utils";

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
		.select("*, categories:product_categories(categories(id, name))", { count: "exact" })
		.order("created_at", { ascending: false })
		.range(from, to);

	if (error) {
		throw new Error("Failed fetching products");
	}

	const formattedData = data?.map((product: RawProduct) => {
		{/* Unpacks categories from the data because its nested */}
		const flatCategories =
			(product?.categories)
				?.map((pc) => pc.categories)
				.filter((c): c is Category => c !== null) || [];
		const categoryName = flatCategories.map((c: Category | null) => c?.name).join(", ");
		const createdDate = formatTimeToDMY(product.created_at);

		return {
			...product,
			categories: flatCategories as Category[],
			created_at: createdDate,
			category_name: categoryName || "Uncategorized",
		};
	}) as Product[];

	const totalPages = count !== null ? Math.ceil(count / pageSize) : null;

	return { data: formattedData, error, count, totalPages };
}

export async function getProduct({ id }: { id: string }): Promise<Product> {
	const { data, error } = await supabase
		.from("products")
		.select("*, categories:product_categories(categories(id, name))")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error("Failed fetching this product");
	}

	{/* Unpacks categories from the data because its nested */}
	const flatCategories =
		(data?.categories)
			?.map((pc: ProductCategoryJunction) => pc.categories)
			.filter((c: Category): c is Category => c !== null) || [];
	const categoryName = flatCategories.map((c: Category | null) => c?.name).join(", ");

	return {
		...data,
		categories: flatCategories,
		category_name: categoryName || "Uncategorized",
	};
}
