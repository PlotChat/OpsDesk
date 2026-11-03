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
