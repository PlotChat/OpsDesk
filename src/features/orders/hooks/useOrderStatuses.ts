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
			return updateOrderStatus({ orderId, newStatus });
		},

		// Optimistic Update when mutating
		onMutate: async (variables) => {
			// Stop any background fetches for this order
			await queryClient.cancelQueries({ queryKey: ["order", variables.orderId] });

			// Snapshot the previous cache just in case the API fails
			const previousCache = queryClient.getQueryData<{ data: Order }>(["order", variables.orderId]);

			// Optimistically update the cache instantly
			queryClient.setQueryData(["order", variables.orderId], (oldCache: { data: Order } | undefined) => {
                if (!oldCache?.data) return oldCache; 
                
                return { 
                    ...oldCache, 
                    data: { 
                        ...oldCache.data, 
                        status: variables.newStatus 
                    } 
                };
            });

			// Pass the snapshot to the onError handler
			return { previousCache };
		},

		// Rollback if the API fails
		onError: (_err, variables, context) => {
			if (context?.previousCache) {
				queryClient.setQueryData(["order", variables.orderId], context.previousCache);
			}
		},

		// Always sync with the server when done
		onSettled: (_data, _error, variables) => {
			queryClient.invalidateQueries({ queryKey: ["ordersPage"] });
			queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
		},
	});

	return updateMutation;
};
