import { supabase } from "@/lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";
import type {
	Category,
	Product,
	ProductCategoryJunction,
	ProductFilterType,
	ProductSortType,
	RawProduct,
} from "../types/types";
import { calcTotalPages, formatTimeToDMY, getPageRange } from "@/lib/utils";

export interface ProductPagesResponse {
	data: Product[];
	totalPages: number | null;
	count: number | null;
	error: PostgrestError | null;
}

export interface ProductPagesProps {
	sortBy?: ProductSortType;
	filterBy?: ProductFilterType;
	page: number;
	pageSize: number;
}

export async function getProductsPage({
	sortBy = { column: "created_at", isAscending: false },
	filterBy = { categories: [], minPrice: 0, maxPrice: Number.MAX_VALUE, name: "", sku: "" },
	page,
	pageSize,
}: ProductPagesProps): Promise<ProductPagesResponse> {
	const {from, to} = getPageRange(page, pageSize);

	// Conditionally apply the !inner join ONLY when we are filtering by categories.
	// This forces supabase to filter out the Products themselves, not just their nested categories.
	const hasCategoryFilters = filterBy?.categories?.length > 0;
	const selectQuery = hasCategoryFilters
		? "*, categories:product_categories!inner(categories!inner(id, name))"
		: "*, categories:product_categories(categories(id, name))";

	// Initialize the base query
	let query = supabase.from("products").select(selectQuery, { count: "exact" });

	// Filter by filterable columns
	if (filterBy) {
		if (filterBy.name) {
			query = query.ilike("name", `%${filterBy.name}%`);
		}
		
		if(filterBy.sku) {
			query = query.ilike("sku", `%${filterBy.sku}%`);
		}

		if (hasCategoryFilters) {
			// Map the Category objects to an array of IDs
			const categoryIds = filterBy.categories.map((c) => c.id);

			// Use .in() to match products that have ANY of the selected category IDs
			// For AND operations it is more complex so im leaving this be
			query = query.in("categories.categories.id", categoryIds);
		}

		query = query.lte("price", filterBy.maxPrice);
		query = query.gte("price", filterBy.minPrice);
	}

	// Chain the sorting and pagination
	const { data, error, count } = await query
		.order(sortBy.column as string, { ascending: sortBy.isAscending })
		.order("id", { ascending: true }) // Secondary sort to guarantee stable pagination
		.range(from, to);

	if (error) {
		throw new Error("Failed fetching products");
	}

	const formattedData = data?.map((product: RawProduct) => {
		// Unpacks categories from the data because its nested
		const flatCategories =
			product?.categories?.map((pc) => pc.categories).filter((c): c is Category => c !== null) ||
			[];
		const categoryName = flatCategories.map((c: Category | null) => c?.name).join(", ");
		const createdDate = formatTimeToDMY(product.created_at);

		return {
			...product,
			categories: flatCategories as Category[],
			created_at: createdDate,
			category_name: categoryName || "Uncategorized",
		};
	}) as Product[];

	const totalPages = calcTotalPages(count, pageSize);

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

	// Unpacks categories from the data because its nested */
	const flatCategories =
		data?.categories
			?.map((pc: ProductCategoryJunction) => pc.categories)
			.filter((c: Category): c is Category => c !== null) || [];
	const categoryName = flatCategories.map((c: Category | null) => c?.name).join(", ");

	return {
		...data,
		categories: flatCategories,
		category_name: categoryName || "Uncategorized",
	};
}
