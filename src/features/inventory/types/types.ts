export interface Category {
	id: string;
	name: string;
	description: string | null;
	created_at: string;
}

export type ProductCategoryJunction = {
	categories: Category;
};

export interface Product {
	id: string;
	sku: string;
	name: string;
	price: number | "";
	stock_level: number | "";
	created_at: string;
	categories: Category[];
	category_name?: string;
}

export interface RawProduct {
	id: string;
	sku: string;
	name: string;
	price: number | "";
	stock_level: number | "";
	created_at: string;
	categories: ProductCategoryJunction[];
	category_name?: string;
}

export type SortableProductColumns = "alphabet" | "price" | "date";

export type ProductDbColumns = keyof Pick<Product, "id" | "name" | "price" | "created_at">;

export type FilterableProductColumns = "categories";

export type ProductSortType = {column: keyof Product, isAscending: boolean};

export type ProductFilterType = {
	categories: Category[];
	minPrice: number;
	maxPrice: number;
	name: string;
	sku: string;
};
