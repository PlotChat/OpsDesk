import { supabase } from "@/lib/supabase";

export async function getOrderStatuses() {
	const { data, count, error } = await supabase
		.from("order_statuses")
		.select("*", { count: "exact" })
        .order("sort_order", { ascending: true });

	if (error) {
		throw new Error("Error when fetching order statuses");
	}

	return { data, count };
}
