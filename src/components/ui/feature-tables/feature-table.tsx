import type { ReactNode } from "react";
import { DataTable, type DataTableProps } from "./data-table";
import { cn } from "cn";

function FeatureTable({ children, className }: { children: ReactNode; className?: string }) {
    return <section className={cn(className, "min-h-120 w-full flex flex-col")}>{children}</section>;
}

FeatureTable.Header = function FeatureTableHeader({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn("mb-4 flex flex-col gap-4", className)}>{children}</div>;
};

FeatureTable.Content = function FeatureTableContent<T>({
    data,
    columns,
    rowKey,
    isLoading,
    className,
    isTableFixed = true,
    renderFeatureActions,
}: DataTableProps<T>) {
    return (
        <div className="grow w-full flex flex-col">
            <DataTable
                data={data || []}
                columns={columns}
                rowKey={rowKey}
                className={className}
                isLoading={isLoading}
                isTableFixed={isTableFixed}
                renderFeatureActions={renderFeatureActions}
            ></DataTable>
        </div>
    );
};

export default FeatureTable;