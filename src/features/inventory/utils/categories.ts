import type { Category } from "../types/types";

export const findCategoryById = (categories: Category[], categoryId: string | null): Category | null =>
	categories?.find((c) => c.id === categoryId) || null;
