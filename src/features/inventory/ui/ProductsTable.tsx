import { Button } from "@/components/ui/button";
import { type DataTableColumn } from "@/components/ui/feature-tables/data-table";
import FeatureTable from "@/components/ui/feature-tables/feature-table";
import { toast } from "@/components/ui/toast";
import { IoMdAdd } from "react-icons/io";
import { TbFileExport } from "react-icons/tb";
import type { Product } from "../types/types";
import { useDeleteProduct, useGetProductsPage } from "../hooks/useProducts";
import { useState } from "react";
import ViewEditProductItemDialog from "./ViewEditProductItemDialog";
import { FeatureTablePagination } from "@/components/ui/feature-tables/feature-table-pagination";
import CreateProductDialog from "./CreateProductDialog";
import { useQueryClient } from "@tanstack/react-query";
import ReloadButton from "@/components/ui/reload-button";

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

const ProductHeaderActions = ({ title, isLoading }: { title: string, isLoading: boolean }) => {
	const [isViewCreateModal, setIsViewCreateModal] = useState<boolean>(false);
	const queryClient = useQueryClient();

	return (
		<>
			<div className="flex gap-2">
				<Button>
					<span className="hidden md:block">Export {title.toLowerCase()}</span>
					<TbFileExport />
				</Button>
				<Button onClick={() => setIsViewCreateModal(true)}>
					<span className="hidden md:block">Add new item</span>
					<IoMdAdd />
				</Button>
				<ReloadButton
					isLoading={isLoading}
					onClick={() => queryClient.invalidateQueries({ queryKey: ["productsPage"] })}
				></ReloadButton>
			</div>

			{isViewCreateModal && (
				<CreateProductDialog
					productId={"a9d0e1c9-4e8f-4862-832a-85211b8334ae"}
					title={`Create Product`}
					open={true}
					onOpenChange={(isOpen) => {
						if (!isOpen) setIsViewCreateModal(false);
					}}
				></CreateProductDialog>
			)}
		</>
	);
};

export const ProductsTable = () => {
	const pageSize = 10;
	const [currentPage, setCurrentPage] = useState(1);
	const { products, totalPages, isPending, isFetching, isPlaceholderData, isError, error } = useGetProductsPage(
		{ page: currentPage, pageSize },
	);

	// When a product id is selected through actions in the table, a modal will appear.
	// To close the modal we make this null (according to conditionals at the end of this component)
	const [currProductId, setCurrProductId] = useState<Product["id"]>("");

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	const productColumns = [
		{ key: "sku", label: "SKU", width: "md", truncate: true },
		{ key: "name", label: "Name", width: "xl", truncate: true },
		{ key: "price", label: "Price" },
		{ key: "created_at", label: "Created at" },
	] satisfies DataTableColumn<Product>[];

	return (
		<div className="mb-10 rounded-2xl w-full">
			<div className="h-150 mx-auto flex justify-center items-start">
				{/* The products table */}
				<FeatureTable
					title="Products"
					data={products || []}
					columns={productColumns}
					defaultTotalRows={pageSize}
					isLoading={isPlaceholderData}
					rowKey={"id"}
					renderFeatureActions={(row: Product) => (
						<ProductTableActions productId={row.id} onView={() => setCurrProductId(row.id)} />
					)}
					renderHeaderActions={() => <ProductHeaderActions isLoading={isFetching} title="Products" />}
				/>
			</div>

			{/* Pagination navigation */}

			<FeatureTablePagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			></FeatureTablePagination>

			{/* Modal popup for when viewing a specific product */}
			{currProductId && (
				<ViewEditProductItemDialog
					productId={currProductId}
					title={`Product Details`}
					open={currProductId ? true : false}
					onOpenChange={(isOpen) => {
						if (!isOpen) setCurrProductId("");
					}}
				></ViewEditProductItemDialog>
			)}
		</div>
	);
};

export default ProductsTable;
