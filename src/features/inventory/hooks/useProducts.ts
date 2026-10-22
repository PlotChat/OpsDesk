import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getProducts, type Product } from "../api/getProducts";

export function useProducts(): UseQueryResult<Product[], Error>{
    const productQuery = useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    })

    return productQuery;
}