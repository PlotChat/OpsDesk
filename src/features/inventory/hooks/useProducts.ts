import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProduct, getProducts } from "../api/getProducts";
import { deleteProduct } from "../api/deleteProduct";

export function useGetProducts() {
    const productsQuery = useQuery({
        queryKey: ["getProducts"],
        queryFn: getProducts,
    });

    return {
        ...productsQuery,
    };
}

export function useGetProduct({ id }: { id: string }) {
    return useQuery({
        queryKey: ["products", id],
        queryFn: () => getProduct({ id }),
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            // This will now successfully trigger useProducts to refetch
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return {
        deleteProduct: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
