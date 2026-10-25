import { DataTable, type DataTableProps } from "./data-table";

type FeatureTableProps<T> = DataTableProps<T> & {
	title: string;
	renderHeaderActions?: () => React.ReactNode;
};

function FeatureTable<T>({
	title,
	data,
	columns,
	className,
	renderFeatureActions,
	renderHeaderActions,
}: FeatureTableProps<T>) {
	return (
		<section>
			<div className="flex justify-between">
				<h1 className="text-xl">{title}</h1>
				<div className="space-x-2">
					{renderHeaderActions && renderHeaderActions()}
				</div>
			</div>

			<DataTable
				data={data}
				columns={columns}
				className={className}
				renderFeatureActions={renderFeatureActions}
			></DataTable>
		</section>
	);
}
export default FeatureTable;
