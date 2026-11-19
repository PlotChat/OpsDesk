import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/atoms/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/atoms/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/atoms/select";
import { Skeleton } from "@/components/ui/atoms/skeleton";

export interface AreaSeriesConfig<T> {
	key: Extract<keyof T, string>;
	label: string;
	color: string;
	stackId?: string;
}

export interface FeatureAreaChartProps<T extends Record<string, unknown>> {
	title: string;
	description?: string;
	data: T[];
	dateKey: Extract<keyof T, string>;
	series: readonly AreaSeriesConfig<T>[];
	isLoading?: boolean;
	defaultRange?: TimeRangeKey;
	showLegend?: boolean;
	valueFormatter?: (value: number) => string;
}

const RANGE_OPTIONS = {
	"365d": { label: "Last 12 months", days: 365 },
	"90d": { label: "Last 3 months", days: 90 },
	"30d": { label: "Last 30 days", days: 30 },
	"7d": { label: "Last 7 days", days: 7 },
} as const;

type TimeRangeKey = keyof typeof RANGE_OPTIONS;

export function FeatureAreaChart<T extends Record<string, unknown>>({
	title,
	description,
	data,
	dateKey,
	series,
	isLoading = false,
	defaultRange = "365d",
	showLegend = false,
	valueFormatter = (val) => val.toLocaleString("en-US"),
}: FeatureAreaChartProps<T>) {
	const chartId = React.useId();
	const [timeRange, setTimeRange] = React.useState<TimeRangeKey>(defaultRange);

	// Build Shadcn's ChartConfig dynamically from the passed series
	const chartConfig = React.useMemo(() => {
		const config: ChartConfig = {};
		for (const item of series) {
			config[item.key] = {
				label: item.label,
				color: item.color,
			};
		}
		return config;
	}, [series]);

	const filteredData = React.useMemo(() => {
		const daysToSubtract = RANGE_OPTIONS[timeRange].days;
		const cutoff = new Date();
		cutoff.setHours(0, 0, 0, 0);
		cutoff.setDate(cutoff.getDate() - daysToSubtract);

		return data.filter((item) => new Date(String(item[dateKey])) >= cutoff);
	}, [data, dateKey, timeRange]);

	return (
		<Card className="pt-0">
			<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="grid flex-1 gap-1">
					<CardTitle>{title}</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</div>
				<Select
					value={timeRange}
					onValueChange={(val) => val && setTimeRange(val as TimeRangeKey)}
				>
					<SelectTrigger
						className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
						aria-label="Select time range"
					>
						<SelectValue placeholder={RANGE_OPTIONS[defaultRange].label} />
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						{Object.entries(RANGE_OPTIONS).map(([key, { label }]) => (
							<SelectItem key={key} value={key} className="rounded-lg">
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>

			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				{isLoading ? (
					<Skeleton className="h-62.5 w-full rounded-xl" />
				) : (
					<ChartContainer config={chartConfig} className="aspect-auto h-62.5 w-full">
						<AreaChart data={filteredData}>
							<defs>
								{series.map((s) => (
									<linearGradient
										key={s.key}
										id={`${chartId}-fill-${s.key}`}
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop offset="5%" stopColor={`var(--color-${s.key})`} stopOpacity={0.8} />
										<stop offset="95%" stopColor={`var(--color-${s.key})`} stopOpacity={0.1} />
									</linearGradient>
								))}
							</defs>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey={dateKey}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={(value) =>
									new Date(value).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									})
								}
							/>
							<ChartTooltip
								cursor={false}
								content={
									<ChartTooltipContent
										labelFormatter={(value) =>
											new Date(value).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})
										}
										formatter={(value, name) => [
											valueFormatter(Number(value)), " ",
											chartConfig[String(name)]?.label ?? name,
										]}
										indicator="dot"
									/>
								}
							/>
							{series.map((s) => (
								<Area
									key={s.key}
									dataKey={s.key}
									type="monotone"
									fill={`url(#${chartId}-fill-${s.key})`}
									stroke={`var(--color-${s.key})`}
									stackId={s.stackId}
								/>
							))}
							{showLegend && <ChartLegend content={<ChartLegendContent />} />}
						</AreaChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
