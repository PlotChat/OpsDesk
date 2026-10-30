import type { ReactNode } from "react";
import { DataTable, type DataTableProps } from "./data-table";
import { cn } from "cn";

type FeatureTableProps<T> = DataTableProps<T> & {
	title: string;
	tableClassName?: string;
	renderHeaderActions?: () => React.ReactNode;
	children?: ReactNode;
};

function FeatureTable<T>({
	title,
	defaultTotalRows,
	data,
	columns,
	rowKey,
	isLoading,
	className,
	tableClassName,
	renderFeatureActions,
	renderHeaderActions,
	children,
}: FeatureTableProps<T>) {
	return (
		<section className={cn(className, "w-full")}>
			<div className="flex justify-between mb-2.5">
				<h1 className="text-xl">{title}</h1>
				<div className="space-x-2">
					{renderHeaderActions && renderHeaderActions()}
				</div>
			</div>
			
			<DataTable
				data={data}
				columns={columns}
				rowKey={rowKey}
				className={tableClassName}
				isLoading={isLoading}
				defaultTotalRows={defaultTotalRows}
				renderFeatureActions={renderFeatureActions}
			></DataTable>

			{children}
		</section>
	);
}
export default FeatureTable;
