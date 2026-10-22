import { supabase } from "@/lib/supabase";

export interface Order{
    id: string,
    customer_name: string,
    status: string,
    total_amount: number,
    created_at: string
}

export async function getOrders(): Promise<Order[]>{
    const { data, error } = await supabase.from('orders').select('*');

    if(error){
        throw new Error("Error when fetching orders");
    }
    
    return data;
}