import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./table";

export interface Column<T> {
	key: keyof T;
	label: string;
	align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	footerTotal?: string;
	className?: string;
	renderFeatureActions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
	data,
	columns,
	className,
	renderFeatureActions,
}: DataTableProps<T>) {
	return (
		<Table className={className}>
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
						<TableCell className="text-center">Action</TableCell>
					)}
				</TableRow>
			</TableHeader>

			<TableBody>
				{data.map((row, rowIndex) => (
					<TableRow key={rowIndex}>
						{columns.map((col) => (
							<>
								<TableCell
									key={String(col.key)}
									className={col.align === "right" ? "text-right" : ""}
								>
									{String(row[col.key])}
								</TableCell>
							</>
						))}
						{renderFeatureActions && (
							<TableCell className="text-center">
								{renderFeatureActions(row)}
							</TableCell>
						)}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
