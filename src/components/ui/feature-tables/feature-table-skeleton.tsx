import { Skeleton } from "@/components/ui/atoms/skeleton";
import { TableBody, TableCell, TableRow } from "./table";

interface FeatureTableSkeletonProps {
	columnCount: number;
	rowActions?: 0 | 1 | 2;
	rowCount?: number;
}

export function FeatureTableSkeleton({
	columnCount,
	rowActions = 0,
	rowCount = 10,
}: FeatureTableSkeletonProps) {
	return (
		<TableBody aria-hidden="true">
			{Array.from({ length: rowCount }, (_, rowIndex) => (
				<TableRow key={`skeleton-row-${rowIndex}`}>
					{Array.from({ length: columnCount }, (_, columnIndex) => (
						<TableCell key={`skeleton-cell-${columnIndex}`}>
							<Skeleton
								className={columnIndex % 2 === 0 ? "h-4 w-4/5" : "h-4 w-3/5"}
							/>
						</TableCell>
					))}
					{rowActions > 0 && (
						<TableCell>
							<div className="flex justify-center gap-1">
								{Array.from({ length: rowActions }, (_, actionIndex) => (
									<Skeleton
										key={`skeleton-action-${actionIndex}`}
										className={rowActions === 1 ? "h-8 w-24" : "h-8 w-20"}
									/>
								))}
							</div>
						</TableCell>
					)}
				</TableRow>
			))}
		</TableBody>
	);
}
