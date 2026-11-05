import { supabase } from "@/lib/supabase";

export async function deleteOrder({ id }: { id: string }): Promise<boolean> {
	const { error } = await supabase.from("orders").delete().eq("id", id);

	if (error) {
		throw new Error("Error when fetching orders");
	}

	return true;
}
