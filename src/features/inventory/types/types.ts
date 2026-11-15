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

// Type for top selling products
export interface TopSellingProduct extends Product{
	index: number;
	total_ordered: number;
	order_count: number;
	total_revenue: number;
}

// Type for revenue when calulating for revenue by categories
export interface RevenueCategory extends Category{
	revenue: number,
	units_sold: number,
	order_count: number
}

export type ProductDbColumns = keyof Pick<Product, "id" | "name" | "price" | "created_at">;

export type ProductFilterType = {
	categories: Category[];
	minPrice: number;
	maxPrice: number;
	search?: string;
	name?: string;
	sku?: string;
};
