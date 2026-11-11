import type { PostgrestError } from "@supabase/supabase-js";

export interface FeatureTablePagesResponse<T> {
	data: T[];
	totalPages: number | null;
	count: number | null;
	error: PostgrestError | null;
}

export interface FeatureTablePagesProps {
	page: number;
	pageSize: number;
}