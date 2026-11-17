import { type DataTableColumn } from "@/components/ui/feature-tables/data-table";
import FeatureTable, {
	type FeatureTableSortOption,
} from "@/components/ui/feature-tables/feature-table";
import { toast } from "@/components/ui/toast";
import type { Product, ProductFilterType } from "../types/types";
import { useDeleteProduct, useGetProductsPage } from "../hooks/useProducts";
import { useState } from "react";
import ViewEditProductItemDialog from "./ViewEditProductItemDialog";
import CreateProductDialog from "./CreateProductDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
	DropdownMenuCheckboxItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCategories } from "../hooks/useCategories";
import { MdAccessTime, MdOutlineCategory } from "react-icons/md";
import { BsAlphabetUppercase } from "react-icons/bs";
import { IoPricetagsOutline } from "react-icons/io5";
import type { FeatureTableSortType } from "@/components/ui/feature-tables/types";
import { cn } from "cn";
import { formatCurrency } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

// Table's columns
const productColumns = [
	{ key: "sku", label: "SKU", width: "md", truncate: true },
	{ key: "name", label: "Name", width: "xl", truncate: true },
	{ key: "price", label: "Price", renderElements: (row) => formatCurrency(row.price) },
	{ key: "created_at", label: "Created at" },
] satisfies DataTableColumn<Product>[];

// Options directly map to real database column names
const sortOptions = [
	{ value: "name", label: "Alphabet", icon: BsAlphabetUppercase },
	{ value: "price", label: "Price", icon: IoPricetagsOutline },
	{ value: "created_at", label: "Date", icon: MdAccessTime },
] satisfies FeatureTableSortOption<Product>[];

export const ProductsTable = ({ className }: { className: string }) => {
	// Simple page states
	const pageSize = 10;
	const [currentPage, setCurrentPage] = useState(1);
	const [isViewCreateModal, setIsViewCreateModal] = useState<boolean>(false);
	const [currProductId, setCurrProductId] = useState<Product["id"]>("");

	// Sort and Filter states
	const [sortBy, setSortBy] = useState<FeatureTableSortType<Product>>({
		column: "created_at",
		isAscending: false,
	});

	const [filters, setFilters] = useState<ProductFilterType>({
		categories: [],
		maxPrice: Number.MAX_VALUE,
		minPrice: 0,
		search: "",
	});

	// Search states
	const [searchInput, setSearchInput] = useState("");
	const debouncedSearch = useDebounce({
		value: searchInput,
		delay: 300,
		onDebounce: () => setCurrentPage(1),
	});

	// Handlers
	const handleSearchChange = (value: string) => {
		setSearchInput(value);
	};

	const handleFiltersChange = (newFilters: Omit<ProductFilterType, "search">) => {
		setFilters(newFilters);
		setCurrentPage(1);
	};

	const handleSortBy = (newSort: FeatureTableSortType<Product>) => {
		if (!newSort) return;

		setSortBy(newSort);
		setCurrentPage(1);
	};

	// Queries
	const queryClient = useQueryClient();
	const { products, totalPages, isPending, isFetching, isPlaceholderData, isError, error } =
		useGetProductsPage({
			page: currentPage,
			pageSize,
			sortBy,
			filterBy: { ...filters, search: debouncedSearch },
		});

	const { categories } = useGetCategories();

	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className={cn("mx-auto flex flex-col justify-between", className)}>
			{/* The products table */}
			<FeatureTable className="h-170">
				<FeatureTable.Header>
					<FeatureTable.Title>Products</FeatureTable.Title>

					<FeatureTable.Actions>
						{/* Search input - searches both name and SKU via Supabase .or() */}
						<FeatureTable.Search
							placeholder="Name or SKU..."
							value={searchInput}
							onChange={handleSearchChange}
						/>

						{/* Filter dropdown - compares categories by id instead of object reference */}
						<FeatureTable.Filter>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<MdOutlineCategory />
									Categories
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									{categories.map((c) => {
										const isChecked = filters.categories.some((cat) => cat.id === c.id);
										return (
											<DropdownMenuCheckboxItem
												key={c.id}
												checked={isChecked}
												onCheckedChange={() => {
													const nextCategories = isChecked
														? filters.categories.filter((cat) => cat.id !== c.id)
														: [...filters.categories, c];

													handleFiltersChange({
														...filters,
														categories: nextCategories,
													});
												}}
											>
												{c.name}
											</DropdownMenuCheckboxItem>
										);
									})}
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</FeatureTable.Filter>

						{/* Sort dropdown - standardized to { column, isAscending } */}
						<FeatureTable.Sort value={sortBy} onChange={handleSortBy} options={sortOptions} />

						{/* Add button */}
						<FeatureTable.AddButton onClick={() => setIsViewCreateModal(true)} />

						{/* Reload button */}
						<FeatureTable.ReloadButton
							isLoading={isFetching}
							onClick={() => queryClient.invalidateQueries({ queryKey: ["productsPage"] })}
						/>
					</FeatureTable.Actions>
				</FeatureTable.Header>

				<FeatureTable.Content
					data={products}
					columns={productColumns}
					isLoading={isPending || isPlaceholderData}
					loadingRowActions={2}
					className="h-full"
					rowKey={"id"}
					renderFeatureActions={(row: Product) => (
						<ProductTableActions productId={row.id} onView={() => setCurrProductId(row.id)} />
					)}
				/>

				{/* Pagination navigation */}
				<FeatureTable.Pagination
					className="mt-3"
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</FeatureTable>

			{/* Modal popup for when viewing a specific product */}
			{currProductId && (
				<ViewEditProductItemDialog
					productId={currProductId}
					title="Product Details"
					open={Boolean(currProductId)}
					onOpenChange={(isOpen) => {
						if (!isOpen) setCurrProductId("");
					}}
				/>
			)}

			{/* Modal popup for creating a product */}
			{isViewCreateModal && (
				<CreateProductDialog
					productId="a9d0e1c9-4e8f-4862-832a-85211b8334ae"
					title="Create Product"
					open={true}
					onOpenChange={(isOpen: boolean) => {
						if (!isOpen) setIsViewCreateModal(false);
					}}
				/>
			)}
		</div>
	);
};

export default ProductsTable;

const ProductTableActions = ({
	productId,
	onView,
}: {
	productId: Product["id"];
	onView: () => void;
}) => {
	const { deleteProduct, isDeleting } = useDeleteProduct();

	return (
		<div className="flex gap-1 justify-center">
			<Button onClick={onView}>View / Edit</Button>
			<Button
				variant="destructive"
				onClick={() => {
					deleteProduct({ id: productId });
					toast.add({
						title: "Product deleted!",
						description: new Intl.DateTimeFormat().format(),
					});
				}}
				disabled={isDeleting}
			>
				{isDeleting ? "..." : "Delete"}
			</Button>
		</div>
	);
};
