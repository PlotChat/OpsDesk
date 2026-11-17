import { FeatureAreaChart } from "@/components/ui/chart/feature-area-chart";
import { useOrderChartStats } from "../hooks/useOrders";

const OrdersAreaChart = () => {
	const { data: orderStats = [], isPending } = useOrderChartStats(365);

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<FeatureAreaChart
				title="Revenue Overview"
				description="Daily gross order revenue"
				defaultRange="90d"
				data={orderStats}
				dateKey="date"
				isLoading={isPending}
				series={[{ key: "revenue", label: "Revenue", color: "var(--color-green-300)" }]}
				valueFormatter={(val) =>
					`$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
				}
			/>

			<FeatureAreaChart
				title="Order Volume"
				description="Completed and active orders per day"
				defaultRange="90d"
				data={orderStats}
				dateKey="date"
				isLoading={isPending}
				series={[{ key: "orders", label: "Orders", color: "var(--color-violet-500)" }]}
			/>
		</div>
	);
};
export default OrdersAreaChart;
