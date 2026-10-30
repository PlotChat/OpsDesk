import { Button } from "@/components/ui/button";
import { type Column } from "@/components/ui/feature-tables/data-table";
import FeatureTable from "@/components/ui/feature-tables/feature-table";
import { toast } from "@/components/ui/toast";
import { IoMdAdd } from "react-icons/io";
import { TbFileExport } from "react-icons/tb";
import type { Product } from "../api/getProducts";
import { useDeleteProduct, useGetProductsPage } from "../hooks/useProducts";
import { useState } from "react";
import GetProductItemDialog from "./GetProductItemDialog";
import { FeatureTablePagination } from "@/components/ui/feature-tables/feature-table-pagination";

const productColumns = [
	{ key: "id", label: "Id" },
	{ key: "name", label: "Name" },
	{ key: "category", label: "Category" },
	{ key: "price", label: "Price" },
] satisfies Column<Product>[];

const ProductTableActions = ({
	productId,
	onView,
}: {
	productId: string;
	onView: () => void;
}) => {
	const { deleteProduct, isDeleting } = useDeleteProduct();

	return (
		<div className="flex gap-1 justify-center">
			<Button onClick={onView}>View</Button>
			<Button variant="secondary">Edit</Button>
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

const ProductHeaderActions = ({ title }: { title: string }) => {
	return (
		<>
			<Button>
				<span className="hidden md:block">Export {title.toLowerCase()}</span>
				<TbFileExport />
			</Button>
			<Button>
				<span className="hidden md:block">Add new item</span>
				<IoMdAdd />
			</Button>
		</>
	);
};

export const ProductsTable = () => {
	const pageSize = 10;
	const [currentPage, setCurrentPage] = useState(1);
	const { products, totalPages, isPlaceholderData, isPending, isError, error } =
		useGetProductsPage({ page: currentPage, pageSize });

	// When a product id is selected through actions in the table, a modal will appear.
	// To close the modal we make this null (according to conditionals below)
	const [currProductId, setCurrProductId] = useState<string | null>(null);

	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

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
						<ProductTableActions
							productId={row.id}
							onView={() => setCurrProductId(row.id)}
						/>
					)}
					renderHeaderActions={() => <ProductHeaderActions title="Products" />}
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
				<GetProductItemDialog
					productId={currProductId}
					title={`Product - ${currProductId}`}
					open={true}
					onOpenChange={(isOpen) => {
						if (!isOpen) setCurrProductId(null);
					}}
				></GetProductItemDialog>
			)}
		</div>
	);
};

export default ProductsTable;
