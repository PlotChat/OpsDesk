import * as React from "react";
import { Pie, PieChart } from "recharts";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "cn";

const DEFAULT_COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
] as const;

export interface FeaturePieChartProps<T> {
    containerClassName?: string,
	data: T[];
	nameKey: Extract<keyof T, string>;
	valueKey: Extract<keyof T, string>;
	colorKey?: Extract<keyof T, string>;
	colors?: readonly string[];
	isLoading?: boolean;
	showLegend?: boolean;
	valueFormatter?: (value: number) => string;
}

export function FeaturePieChart<T>({
    containerClassName,
	data,
	nameKey,
	valueKey,
	colorKey,
	colors = DEFAULT_COLORS,
	isLoading = false,
	showLegend = true,
	valueFormatter = (value) => value.toLocaleString("en-US"),
}: FeaturePieChartProps<T>) {
	const pieData = React.useMemo(
		() =>
			data.map((item, index) => {
				const name = String(item[nameKey] ?? `Slice ${index + 1}`);
				const value = Number(item[valueKey]);
				const itemColor = colorKey ? item[colorKey] : undefined;
				const configKey = `slice-${index}`;
				const color =
					typeof itemColor === "string" && itemColor.length > 0
						? itemColor
						: (colors[index % colors.length] ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]);

				return {
					configKey,
					name,
					value: Number.isFinite(value) ? value : 0,
					fill: `var(--color-${configKey})`,
					color,
				};
			}),
		[data, nameKey, valueKey, colorKey, colors],
	);

	const chartConfig = React.useMemo(() => {
		const config: ChartConfig = {};
		for (const slice of pieData) {
			config[slice.configKey] = {
				label: slice.name,
				color: slice.color,
			};
		}
		return config;
	}, [pieData]);

	return (
		<div className="w-full">
			{isLoading ? (
				<Skeleton className="h-62.5 w-full rounded-xl" />
			) : (
				<ChartContainer config={chartConfig} className={cn("mx-auto aspect-square max-h-100 w-full", containerClassName)}>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									hideLabel
									formatter={(value, name) => [valueFormatter(Number(value)), " ", name]}
								/>
							}
						/>
						<Pie
							data={pieData}
							dataKey="value"
							nameKey="name"
							stroke="var(--background)"
							strokeWidth={2}
						/>

						{showLegend && (
							<div>
								<ChartLegend className="flex-wrap" content={<ChartLegendContent nameKey="configKey" />} />
							</div>
						)}
					</PieChart>
				</ChartContainer>
			)}
		</div>
	);
}
