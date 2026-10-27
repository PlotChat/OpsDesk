import { Button } from "@/components/ui/button";
import { type Column } from "@/components/ui/feature-tables/data-table";
import FeatureTable from "@/components/ui/feature-tables/feature-table";
import { toast } from "@/components/ui/toast";
import { IoMdAdd } from "react-icons/io";
import { TbFileExport } from "react-icons/tb";
import type { Product } from "../api/getProducts";
import { useDeleteProduct, useGetProducts } from "../hooks/useProducts";
import { useState } from "react";

import GetProductItemDialog from "./GetProductItemDialog";

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
	const { data: products, isPending, isError, error } = useGetProducts();
	
	// When a product id is selected through actions in the table, a modal will appear.
	// To close the modal we make this null (according to conditionals below)
	const [currProductId, setCurrProductId] = useState<string | null>(null);
	
	if (isPending) return <div>Loading...</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<>
			<FeatureTable
				title="Products"
				data={products}
				columns={productColumns}
				className="mt-5"
				renderFeatureActions={(row: Product) => (
					<ProductTableActions
						productId={row.id}
						onView={() => setCurrProductId(row.id)}
					/>
				)}
				renderHeaderActions={() => <ProductHeaderActions title="Products" />}
			/>

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
		</>
	);
};

export default ProductsTable;
