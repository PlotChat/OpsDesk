import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "cn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

type SkeletonColumnWidth = "xs" | "sm" | "md" | "lg" | "xl";
type ToolbarControl = "search" | "filter" | "sort" | "add" | "reload";

interface FeatureTableSkeletonProps {
	title: string;
	columns: (SkeletonColumnWidth | undefined)[];
	toolbar: ToolbarControl[];
	rowActions?: 0 | 1 | 2;
	rowCount?: number;
	className?: string;
}

const columnWidths: Record<SkeletonColumnWidth, string> = {
	xs: "w-12",
	sm: "w-32",
	md: "w-48",
	lg: "w-64",
	xl: "w-96",
};

const controlWidths: Record<Exclude<ToolbarControl, "search">, string> = {
	filter: "w-24",
	sort: "w-20",
	add: "w-10",
	reload: "w-10",
};

export function FeatureTableSkeleton({
	title,
	columns,
	toolbar,
	rowActions = 0,
	rowCount = 10,
	className,
}: FeatureTableSkeletonProps) {
	return (
		<section
			aria-label={`${title} table loading`}
			aria-busy="true"
			className={cn(className, "min-h-120 w-full flex flex-col")}
		>
			<div className="mb-4 flex flex-col gap-4">
				<div className="flex items-center">
					<h1 className="text-2xl font-normal text-foreground">{title}</h1>
				</div>
				<div className="flex w-full items-center gap-2 *:h-9.5">
					{toolbar.map((control, index) =>
						control === "search" ? (
							<Skeleton key={`${control}-${index}`} className="h-9.5 min-w-32 flex-1" />
						) : (
							<Skeleton
								key={`${control}-${index}`}
								className={cn("shrink-0 rounded-md", controlWidths[control])}
							/>
						),
					)}
				</div>
			</div>

			<div className="grow w-full flex flex-col">
				<Table className="table-fixed w-full">
					<TableHeader>
						<TableRow>
							{columns.map((width, index) => (
								<TableHead
									key={`header-${index}`}
									className={width ? columnWidths[width] : undefined}
								>
									<Skeleton className="h-4 w-3/5" />
								</TableHead>
							))}
							{rowActions > 0 && (
								<TableHead className="w-24 text-center">
									<Skeleton className="mx-auto h-4 w-12" />
								</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: rowCount }, (_, rowIndex) => (
							<TableRow key={`row-${rowIndex}`}>
								{columns.map((_, columnIndex) => (
									<TableCell key={`cell-${columnIndex}`}>
										<Skeleton
											className={cn(
												"h-4",
												columnIndex % 2 === 0 ? "w-4/5" : "w-3/5",
											)}
										/>
									</TableCell>
								))}
								{rowActions > 0 && (
									<TableCell>
										<div className="flex justify-center gap-1">
											{Array.from({ length: rowActions }, (_, actionIndex) => (
												<Skeleton
													key={`action-${actionIndex}`}
													className={cn("h-8", rowActions === 1 ? "w-24" : "w-20")}
												/>
											))}
										</div>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="mt-3 flex justify-center gap-1">
				<Skeleton className="size-9 rounded-md" />
				<Skeleton className="size-9 rounded-md" />
				<Skeleton className="size-9 rounded-md" />
				<Skeleton className="size-9 rounded-md" />
				<Skeleton className="size-9 rounded-md" />
			</div>
		</section>
	);
}
