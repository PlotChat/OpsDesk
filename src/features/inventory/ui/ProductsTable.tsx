import { Button } from "@/components/ui/button";
import { type Column } from "@/components/ui/feature-tables/data-table";
import FeatureTable from "@/components/ui/feature-tables/feature-table";
import { toast } from "@/components/ui/toast";
import ProductItemAlertDialog from "@/features/inventory/ui/ProductItemAlertDialog";
import { IoMdAdd } from "react-icons/io";
import { TbFileExport } from "react-icons/tb";
import type { Product } from "../api/getProducts";
import useProducts from "../hooks/useGetProducts";

const productColumns = [
	{ key: "id", label: "Id" },
	{ key: "name", label: "Name" },
	{ key: "category", label: "Category" },
	{ key: "price", label: "Price" },
] satisfies Column<Product>[];

const ProductTableActions = ({ productId }: { productId: string }) => {
	const { deleteProduct, isDeleting } = useProducts();
	const { data, isPending, isError, error } = useProducts();

	return (
		<div className="flex gap-1 justify-center">
			<ProductItemAlertDialog item={product}></ProductItemAlertDialog>
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
				Delete
			</Button>
		</div>
	);
};

const ProductHeaderActions = ({ title }: { title: string }) => {
	return (
		<>
			<Button>
				<span className="hidden md:block">Export {title.toLowerCase()}</span>
				<TbFileExport></TbFileExport>
			</Button>
			<Button>
				<span className="hidden md:block">Add new item</span>
				<IoMdAdd></IoMdAdd>
			</Button>
		</>
	);
};

export const ProductsTable = () => {
	const { data, isPending, isError, error } = useProducts();

	if (isPending) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<>
			<FeatureTable
				title="Products"
				data={data}
				columns={productColumns}
				className="mt-5"
				renderFeatureActions={(row: Product) => (
					<ProductTableActions productId={row.id} />
				)}
				renderHeaderActions={() => {
					<ProductHeaderActions title="Products" />;
				}}
			></FeatureTable>
		</>
	);
};
export default ProductsTable;
