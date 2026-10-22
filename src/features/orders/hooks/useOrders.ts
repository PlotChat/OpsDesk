import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getOrders, type Order } from "../api/getOrders"

export function useOrders(): UseQueryResult<Order[], Error>{
    const query = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders
    }) 

    return query
}

