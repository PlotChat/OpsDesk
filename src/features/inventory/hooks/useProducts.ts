import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { getProduct, getProductsPage } from "../api/getProducts";
import { deleteProduct } from "../api/deleteProduct";
import { createProduct } from "../api/createProduct";

export function useGetProductsPage({
	page,
	pageSize,
}: {
	page: number;
	pageSize: number;
}) {
	const productsQuery = useQuery({
		queryKey: ["productsPage", page, pageSize],
		queryFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return getProductsPage({ pageSize, page });
		},
		placeholderData: keepPreviousData,
	});

	return {
		products: productsQuery.data?.data || [],
		totalPages: productsQuery.data?.totalPages || 1,
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
		}
	});

	return createMutation;
}
