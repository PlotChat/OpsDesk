import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct, getProductsPage, type ProductPagesProps } from "../api/getProducts";
import { deleteProduct } from "../api/deleteProduct";
import { createProduct } from "../api/createProduct";
import { editProduct } from "../api/editProduct";
import type { Product } from "../types/types";

export function useGetProductsPage({ page, pageSize }: ProductPagesProps) {
	const productsQuery = useQuery({
		queryKey: ["productsPage", page, pageSize],
		queryFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return getProductsPage({ pageSize, page });
		},
		placeholderData: keepPreviousData,
		refetchOnWindowFocus: false,
	});

	return {
		products: productsQuery.data?.data || [],
		totalPages: productsQuery.data?.totalPages || 1,
		...productsQuery,
	};
}

export function useGetProduct({ id }: { id: string }) {
	const productQuery = useQuery({
		queryKey: ["product", id],
		queryFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return getProduct({ id });
		},
	});

	return { product: productQuery.data, ...productQuery };
}

export function useDeleteProduct() {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["productsPage"] });
		},
	});

	return {
		deleteProduct: deleteMutation.mutate,
		isDeleting: deleteMutation.isPending,
	};
}

export function useCreateProduct() {
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["productsPage"] });
		},
	});

	return createMutation;
}

export function useEditProduct() {
	const queryClient = useQueryClient();

	const editMutation = useMutation({
		mutationFn: editProduct,
		onSuccess: (_, variables) => {
			// Instantly overwrite the specific product cache with the new input
			queryClient.setQueryData(["product", variables.id], (oldData: Product) => ({
				...oldData,
				...variables,
			}));

			// Trigger a background refetch to ensure strict DB sync
			queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
			queryClient.invalidateQueries({ queryKey: ["productsPage"] });
		},
	});

	return editMutation;
}
