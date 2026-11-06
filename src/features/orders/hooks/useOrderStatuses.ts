import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrderStatuses } from "../api/getOrderStatuses";
import type { Order, OrderStatus } from "../types/types";
import { updateOrderStatus } from "../api/updateOrderStatus";

export const useOrderStatuses = () => {
	const orderStatusQuery = useQuery({
		queryKey: ["orderStatuses"],
		queryFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return getOrderStatuses();
		},
		refetchOnWindowFocus: false,
		staleTime: 60000,
	});

	return {
		orderStatuses: orderStatusQuery.data?.data as OrderStatus[] | undefined,
		...orderStatusQuery,
	};
};

export const useUpdateOrderStatus = () => {
	const queryClient = useQueryClient();
	const updateMutation = useMutation({
		mutationFn: async ({
			orderId,
			newStatus,
		}: {
			orderId: Order["id"];
			newStatus: OrderStatus["id"];
		}) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return updateOrderStatus({orderId, newStatus});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["ordersPage"] });
			queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
		},
	});

	return updateMutation;
};
