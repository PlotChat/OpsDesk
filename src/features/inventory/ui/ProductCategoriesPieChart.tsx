import { FeaturePieChart } from "@/components/ui/chart/feature-pie-chart";
import { useGetRevenueByCategory } from "../hooks/useCategories";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

const daysBackOptions = [
	{ value: 30, label: "30 days" },
	{ value: 90, label: "3 months" },
	{ value: 360, label: "1 year" },
];

const COLORS = [
	"#3b82f6", // Blue
	"#10b981", // Emerald
	"#f59e0b", // Amber
	"#8b5cf6", // Violet
	"#f43f5e", // Rose
	"#06b6d4", // Cyan
	"#84cc16", // Lime
	"#ec4899", // Pink
] as const;

const ProductCategoriesPieChart = ({ className }: { className: string }) => {
	const [ daysBack, setDaysBack ] = useState<number>(30);
	const { allRevenueByCategory, isPending } = useGetRevenueByCategory({ daysBack });

	return (
		<div className={cn(className)}>
			<div>
				<h1 className="text-2xl">Revenue by Category</h1>
			</div>

			<div className="flex gap-2 mt-5 mb-3">
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

			<FeaturePieChart
                colors={COLORS}
                containerClassName="h-71 mt-3"
				data={allRevenueByCategory ?? []}
				nameKey="name"
				valueKey="revenue"
				isLoading={isPending}
				valueFormatter={(value) =>
					`$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
				}
			/>
		</div>
	);
};
export default ProductCategoriesPieChart;
