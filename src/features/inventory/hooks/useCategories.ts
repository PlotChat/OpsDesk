import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/getCategories";

export function useGetCategories() {
	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: getCategories,
		staleTime: 20000,
	});

	return {
        categories: categoriesQuery.data?.data || [],
		count: categoriesQuery.data?.count || null,
		...categoriesQuery
	};
}
