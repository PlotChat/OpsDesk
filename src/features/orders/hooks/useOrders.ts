import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrder, getOrdersPage } from "../api/getOrders.ts";
import { deleteOrder } from "../api/deleteOrder.ts";
import type { Order, OrderFilterType } from "../types/types.ts";
import { formatTimeToDMY } from "@/lib/utils.ts";
import type { FeatureTablePagesProps } from "@/components/ui/feature-tables/types.ts";

export function useGetOrdersPage({ page, pageSize, sortBy, filterBy }: FeatureTablePagesProps<Order, OrderFilterType>) {
	const ordersQuery = useQuery({
		queryKey: ["ordersPage", page, pageSize, sortBy, filterBy],
		queryFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return getOrdersPage({ page, pageSize, sortBy, filterBy });
		},
		placeholderData: keepPreviousData,
		refetchOnWindowFocus: false,
	});

	const formattedData = ordersQuery.data?.data.map(
		(o: Order) => ({...o, created_at: formatTimeToDMY(o.created_at)}),
	);

	return {
		orders: formattedData || [],
		totalPages: ordersQuery.data?.totalPages || 1,
		...ordersQuery,
	};
}

export function useGetOrder({ id }: { id: string }) {
	const ordersQuery = useQuery({
		queryKey: ["order", id],
		queryFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return getOrder({ id });
		},
	});

	return {
		order: ordersQuery.data?.data,
		...ordersQuery,
	};
}

export function useDeleteOrder() {
	const queryClient = useQueryClient();

	const ordersMutation = useMutation({
		mutationFn: async ({ id }: { id: string }) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return deleteOrder({ id });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["ordersPage"] });
		},
	});

	return { deleteOrder: ordersMutation.mutate, isDeleting: ordersMutation.isPending };
}
