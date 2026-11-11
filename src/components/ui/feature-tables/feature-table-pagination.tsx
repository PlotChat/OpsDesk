import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { generatePagination } from "@/utils/generatePagination";

export interface FeatureTablePaginationProps {
	currentPage: number;
	totalPages: number;
	className?: string;
	onPageChange: (page: number) => void;
}

export function FeatureTablePagination({
	onPageChange,
	currentPage,
	totalPages,
	className,
}: FeatureTablePaginationProps) {
	const pagination = generatePagination(currentPage, totalPages);

	return (
		<Pagination className={className}>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={(e) => {
							e.preventDefault();
							if (currentPage > 1) onPageChange(currentPage - 1);
						}}
						className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
					/>
				</PaginationItem>

				{pagination.map((p, i) => (
					<PaginationItem key={i}>
						{p === "..." ? (
							<PaginationEllipsis />
						) : (
							<PaginationLink
								href="#"
								isActive={currentPage === p}
								onClick={(e) => {
									e.preventDefault();
									onPageChange(p as number);
								}}
							>
								{p}
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(e) => {
							e.preventDefault();
							if (currentPage < totalPages) onPageChange(currentPage + 1);
						}}
						className={
							currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
