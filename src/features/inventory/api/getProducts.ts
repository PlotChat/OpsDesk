import { supabase } from "@/lib/supabase";

export interface Product {
	id: string;
	sku: string;
	name: string;
	category: string;
	price: number;
	stock_level: number;
	created_at: string;
}

export async function getProducts(): Promise<Product[]> {
	const { data, error } = await supabase.from("products").select("*");

    if(error){
        throw new Error("Failed fetching products");
    }

	return data;
}
