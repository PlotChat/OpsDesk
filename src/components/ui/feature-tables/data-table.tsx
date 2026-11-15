import { cn } from "@/lib/utils"; // Make sure your cn import is correct
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { CgSpinnerAlt } from "react-icons/cg";
import { FeatureTableSkeleton } from "./feature-table-skeleton";

export interface DataTableColumn<T> {
	truncate?: boolean;
	key: keyof T;
	label: string;
	align?: "left" | "center" | "right";
	width?: "xs" | "sm" | "md" | "lg" | "xl";
	getColumnStyles?: (row: T) => string;
	renderElements?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
	data: T[];
	columns: DataTableColumn<T>[];
	rowKey: keyof T | ((row: T) => string | number);
	footerTotal?: string;
	isLoading?: boolean;
	loadingRowCount?: number;
	loadingRowActions?: 0 | 1 | 2;
	isTableFixed?: boolean;
	className?: string;
	renderFeatureActions?: (row: T) => React.ReactNode;
}

function getCellStyles<T>(col: DataTableColumn<T>, isHeader = false) {
	return cn(
		{ "text-right": col.align === "right" },
		{ "text-center": col.align === "center" },
		{
			"w-12": col.width === "xs",
			"w-32": col.width === "sm",
			"w-48": col.width === "md",
			"w-64": col.width === "lg",
			"w-96": col.width === "xl",
		},
		!isHeader && col.truncate ? "truncate max-w-0" : "",
	);
}

export function DataTable<T>({
	data,
	columns,
	rowKey,
	isLoading,
	renderFeatureActions,
	loadingRowCount = 10,
	loadingRowActions = renderFeatureActions ? 1 : 0,
	className,
	isTableFixed,
}: DataTableProps<T>) {
	return (
		<div className="relative flex flex-col">
			{/* Keep the real column headers visible while the initial rows load. */}
			{(data.length > 0 || isLoading) && (
				<Table
					aria-busy={isLoading || undefined}
					className={cn(
						className,
						isLoading && data.length > 0 && "opacity-50",
						isTableFixed && "table-fixed w-full",
					)}
				>
					<TableHeader>
						<TableRow>
							{columns.map((col) => (
								<TableHead key={String(col.key)} className={getCellStyles(col, true)}>
									{col.label}
								</TableHead>
							))}
							{renderFeatureActions && <TableHead className="text-center w-24">Action</TableHead>}
						</TableRow>
					</TableHeader>

					{data.length > 0 ? (
						<TableBody>
							{data.map((row) => {
								const uniqueKey = typeof rowKey === "function" ? rowKey(row) : String(row[rowKey]);
								return (
									<TableRow key={uniqueKey}>
										{columns.map((col) => (
											<TableCell
												key={String(col.key)}
												className={cn(getCellStyles(col, false), col.getColumnStyles?.(row))}
											>
												{col.renderElements ? col.renderElements(row) : String(row[col.key])}
											</TableCell>
										))}
										{renderFeatureActions && (
											<TableCell className="text-center">{renderFeatureActions(row)}</TableCell>
										)}
									</TableRow>
								);
							})}
						</TableBody>
					) : (
						<FeatureTableSkeleton
							columnCount={columns.length}
							rowActions={loadingRowActions}
							rowCount={loadingRowCount}
						/>
					)}
				</Table>
			)}

			{/* Clean Flexbox Empty State (Outside the Table element) */}
			{data.length === 0 && !isLoading && (
				<div className="flex flex-1 items-center justify-center text-muted-foreground w-full">
					No results found.
				</div>
			)}

			{/* Loading Overlay */}
			{isLoading && data.length > 0 && (
				<div className="absolute inset-0 flex items-center justify-center bg-background/10">
					<CgSpinnerAlt className="animate-spin text-3xl" />
				</div>
			)}
		</div>
	);
}
