import type { PostgrestError } from "@supabase/supabase-js";

export interface FeatureTablePagesResponse<T> {
	data: T[];
	totalPages: number | null;
	count: number | null;
	error: PostgrestError | null;
}

export interface FeatureTablePagesProps<T, TFilter = void> {
	page: number;
	pageSize: number;
	sortBy?: FeatureTableSortType<T>;
	filterBy?: TFilter;
	// Filter type should contain columns from your modal that can be filterable:
	// Example from Products:
	// { categories: [], minPrice: 0, maxPrice: Number.MAX_VALUE, search: "" },
}

export type FeatureTableSortType<T> = {
	column: keyof T;
	isAscending: boolean;
};
