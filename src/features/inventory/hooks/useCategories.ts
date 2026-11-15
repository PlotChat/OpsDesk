import { useQuery } from "@tanstack/react-query";
import { getCategories, getRevenueByCategory, type getRevenueByCategoryProps } from "../api/getCategories";

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

export function useGetRevenueByCategory({ daysBack }: getRevenueByCategoryProps) {
	const query = useQuery({
		queryKey: ["allRevenueByCategory", daysBack],
		queryFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 500))
			return getRevenueByCategory({ daysBack });
		},
	});

	return { allRevenueByCategory: query.data, ...query };
}
