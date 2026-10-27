import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct, getProducts } from "../api/getProducts";
import { deleteProduct } from "../api/deleteProduct";

export function useGetProducts() {
	const productsQuery = useQuery({
		queryKey: ["products"],
		queryFn: getProducts,
	});

	return {
		products: productsQuery.data,
		...productsQuery,
	};
}

export function useGetProduct({ id }: { id: string }) {
	const productQuery = useQuery({
		queryKey: ["products", id],
		queryFn: () => getProduct({ id }),
	});

	return { product: productQuery.data, ...productQuery };
}

export function useDeleteProduct() {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			// Triggers useProducts to refetch
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});

	return {
		deleteProduct: deleteMutation.mutate,
		isDeleting: deleteMutation.isPending,
	};
}
