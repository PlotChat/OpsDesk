import FeatureTable, { FeatureTableTitle } from "@/components/ui/feature-tables/feature-table";
import { useGetTopSellingProducts } from "../hooks/useProducts";
import type { DataTableColumn } from "@/components/ui/feature-tables/data-table";
import type { TopSellingProduct } from "../types/types";
import { Button } from "@/components/ui/atoms/button";
import ViewEditProductItemDialog from "./ViewEditProductItemDialog";
import { useState } from "react";
import { cn } from "cn";
import { formatCurrency } from "@/lib/utils";

const columns: DataTableColumn<TopSellingProduct>[] = [
	{ key: "index", label: "#" },
	{ key: "name", label: "Name", tooltip: (row) => `${row.name}` },
	{
		key: "total_revenue",
		label: "Revenue",
		align: "center",
		width: "md",
		renderElements: (row) => formatCurrency(row.total_revenue),
	},
	{ key: "order_count", label: "Orders", align: "center", width: "sm" },
];

const daysBackOptions = [
	{ value: 30, label: "30 days" },
	{ value: 90, label: "3 months" },
	{ value: 360, label: "1 year" },
];

interface ProductsTierTableProps {
	className?: string;
}
const ProductsTierTable = ({ className }: ProductsTierTableProps) => {
	const [daysBack, setDaysBack] = useState<number>(30);
	const { topSellingProducts, isPlaceholderData, isPending } = useGetTopSellingProducts({
		amount: 5,
		daysBack,
	});

	// View product: When a product id is selected through actions in the table, a modal will appear.
	// To close the modal we make this null (according to conditionals at the end of this component)
	const [currProductId, setCurrProductId] = useState<TopSellingProduct["id"]>("");

	return (
		<div className={cn(className, "w-full")}>
			<FeatureTable className={"h-95"}>
				<FeatureTable.Header>
					<FeatureTableTitle>Top Selling Products</FeatureTableTitle>
					<div className="flex gap-2">
						{daysBackOptions.map((o) => (
							<Button
								key={o.value}
								variant={daysBack === o.value ? "default" : "outline"}
								onClick={() => setDaysBack(o.value)}
							>
								{o.label}
							</Button>
						))}
					</div>
				</FeatureTable.Header>

				<FeatureTable.Content
					isLoading={isPending || isPlaceholderData}
					loadingRowCount={5}
					data={topSellingProducts || []}
					rowKey={"id"}
					columns={columns}
					renderFeatureActions={(row) => {
						return (
							<ProductsTierTableActions
								productId={row.id}
								setCurrProductId={setCurrProductId}
							></ProductsTierTableActions>
						);
					}}
				></FeatureTable.Content>
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
		</div>
	);
};

export default ProductsTierTable;

const ProductsTierTableActions = ({
	productId,
	setCurrProductId,
}: {
	productId: TopSellingProduct["id"];
	setCurrProductId: React.Dispatch<React.SetStateAction<string>>;
}) => {
	return (
		<div className="flex justify-center">
			<Button onClick={() => setCurrProductId(productId)}>View/Edit</Button>
		</div>
	);
};
