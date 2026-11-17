import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrderItemsByOrderId } from "../api/getOrderItems";
import type { Order } from "../types/types";

export function useGetOrderItemsByOrderId({ orderId }: { orderId: Order["id"] }) {
	const query = useQuery({
		queryFn: () => getOrderItemsByOrderId({ orderId }),
		queryKey: ["order_items", orderId],
        placeholderData: keepPreviousData,
	});

	return { orderItems: query.data?.data || [], count: query.data?.count, ...query, totalPrice: query?.data?.totalPrice ?? 0 };
}
