import { cn } from "cn";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./table";
import { CgSpinnerAlt } from "react-icons/cg";

export interface Column<T> {
	key: keyof T;
	label: string;
	align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	// Needs key for React lists, this also provides a function in case its hard
	// to know what to assign as key (like if there's no id)
	rowKey: keyof T | ((row: T) => string | number);
	defaultTotalRows: number;
	footerTotal?: string;
	isLoading?: boolean;
	className?: string;
	renderFeatureActions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
	data,
	columns,
	rowKey,
	defaultTotalRows,
	isLoading,
	className,
	renderFeatureActions,
}: DataTableProps<T>) {
	if (defaultTotalRows <= 0)
		throw new Error("DataTable: default total rows must be larger than 0");

	return (
		<div className={"relative"}>
			<Table className={cn(className, { "opacity-50": isLoading })}>
				<TableHeader>
					<TableRow>
						{columns.map((col) => (
							<TableHead
								key={String(col.key)}
								className={col.align === "right" ? "text-right" : ""}
							>
								{col.label}
							</TableHead>
						))}
						{renderFeatureActions && (
							<TableHead className="text-center">Action</TableHead>
						)}
					</TableRow>
				</TableHeader>

				<TableBody>
					{data.length > 0
						? data.map((row) => {
								const uniqueKey =
									typeof rowKey === "function"
										? rowKey(row)
										: String(row[rowKey]);
								return (
									<TableRow key={uniqueKey}>
										{columns.map((col) => (
											<TableCell
												key={String(col.key)}
												className={col.align === "right" ? "text-right" : ""}
											>
												{String(row[col.key])}
											</TableCell>
										))}
										{renderFeatureActions && (
											<TableCell className="text-center">
												{renderFeatureActions(row)}
											</TableCell>
										)}
									</TableRow>
								);
							})
						: Array.from({ length: defaultTotalRows }).map((_, index) => {
								return (
									<TableRow key={index}>
										{columns.map((col) => (
											<TableCell
												key={String(col.key)}
												className={cn(
													col.align === "right" ? "text-right" : "",
													"h-1.5",
												)}
											></TableCell>
										))}
										{renderFeatureActions && (
											<TableCell className="text-center">
												<TableCell className="text-center"></TableCell>
											</TableCell>
										)}
									</TableRow>
								);
							})}
				</TableBody>
			</Table>

			{/* Loading overlay*/}
			{isLoading && (
				<div className="absolute inset-0 content-center justify-center">
					<CgSpinnerAlt className="animate-spin opacity-100 mx-auto text-3xl"></CgSpinnerAlt>
				</div>
			)}
		</div>
	);
}
