import type { ReactNode } from "react";
import { DataTable, type DataTableProps } from "./data-table";
import { cn } from "cn";
import {
	FeatureTablePagination,
	type FeatureTablePaginationProps,
} from "./feature-table-pagination";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReloadButton from "@/components/ui/reload-button";
import { IoSearch, IoFilter } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { BiSortAlt2 } from "react-icons/bi";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import type { FeatureTableSortType } from "./types";
import type { IconType } from "react-icons/lib";

export interface FeatureTableProps extends React.ComponentProps<"section"> {
	children?: ReactNode;
	className?: string;
}

function FeatureTable({ children, className, ...props }: FeatureTableProps) {
	return (
		<section className={cn(className, "min-h-120 w-full flex flex-col")} {...props}>
			{children}
		</section>
	);
}

export interface FeatureTableHeaderProps extends React.ComponentProps<"div"> {
	children?: ReactNode;
	className?: string;
}

function FeatureTableHeader({ children, className, ...props }: FeatureTableHeaderProps) {
	return (
		<div className={cn("mb-4 flex flex-col gap-4", className)} {...props}>
			{children}
		</div>
	);
}

export interface FeatureTableTitleProps extends React.ComponentProps<"div"> {
	children?: ReactNode;
	className?: string;
	titleClassName?: string;
}

function FeatureTableTitle({
	children,
	className,
	titleClassName,
	...props
}: FeatureTableTitleProps) {
	return (
		<div className={cn("flex items-center", className)} {...props}>
			<h1 className={cn("text-2xl font-normal text-foreground", titleClassName)}>{children}</h1>
		</div>
	);
}

export interface FeatureTableActionsProps extends React.ComponentProps<"div"> {
	children?: ReactNode;
	className?: string;
}

function FeatureTableActions({ children, className, ...props }: FeatureTableActionsProps) {
	return (
		<div className={cn("w-full items-center flex gap-2 *:h-9.5", className)} {...props}>
			{children}
		</div>
	);
}

export interface FeatureTableSearchProps {
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	inputClassName?: string;
	inputProps?: React.ComponentProps<typeof InputGroupInput>;
}

function FeatureTableSearch({
	value,
	defaultValue,
	placeholder = "Search...",
	onChange,
	className,
	inputClassName,
	inputProps,
}: FeatureTableSearchProps) {
	return (
		<InputGroup className={className}>
			<InputGroupAddon>
				<IoSearch className="text-secondary-foreground" />
			</InputGroupAddon>
			<InputGroupInput
				value={value}
				defaultValue={defaultValue}
				placeholder={placeholder}
				onChange={(e) => onChange?.(e.target.value, e)}
				className={cn("w-full h-full", inputClassName)}
				{...inputProps}
			/>
		</InputGroup>
	);
}

export interface FeatureTableFilterProps {
	children?: ReactNode;
	triggerText?: string;
	icon?: ReactNode;
	className?: string;
	contentClassName?: string;
	align?: "start" | "center" | "end";
	side?: "top" | "bottom" | "left" | "right";
	triggerProps?: React.ComponentProps<typeof Button>;
}

function FeatureTableFilter({
	children,
	triggerText = "Filter",
	icon = <IoFilter />,
	className,
	contentClassName,
	align = "end",
	side = "bottom",
	triggerProps,
}: FeatureTableFilterProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button className={cn("flex gap-1.5", className)} variant="outline" {...triggerProps}>
						{icon}
						<span>{triggerText}</span>
					</Button>
				}
			/>
			<DropdownMenuContent side={side} align={align} className={contentClassName}>
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export interface FeatureTableSortOption<T> {
	value: Extract<keyof T, string>;
	label: string;
	icon: IconType;
}

export interface FeatureTableSortProps<T> {
	value: FeatureTableSortType<T>;
	onChange: (value: FeatureTableSortType<T>) => void;
	options?: FeatureTableSortOption<T>[];
	children?: ReactNode;
	triggerText?: string;
	icon?: ReactNode;
	className?: string;
	contentClassName?: string;
	align?: "start" | "center" | "end";
	side?: "top" | "bottom" | "left" | "right";
	directionsLabel?: string;
	sortByLabel?: string;
}

function FeatureTableSort<T>({
	value,
	onChange,
	options,
	children,
	triggerText = "Sort",
	icon = <BiSortAlt2 />,
	className,
	contentClassName,
	align = "end",
	side = "bottom",
	directionsLabel = "Directions",
	sortByLabel = "Sort By",
}: FeatureTableSortProps<T>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button className={cn("flex gap-0.5", className)} variant="outline">
						{icon}
						<span>{triggerText}</span>
					</Button>
				}
			/>
			<DropdownMenuContent className={cn("w-max", contentClassName)} side={side} align={align}>
				{children ? (
					children
				) : (
					<>
						<>
							<DropdownMenuGroup>
								<DropdownMenuLabel>{directionsLabel}</DropdownMenuLabel>
								<DropdownMenuRadioGroup
									value={value.isAscending ? "asc" : "desc"}
									onValueChange={(direction) =>
										onChange({ ...value, isAscending: direction === "asc" ? true : false })
									}
								>
									<DropdownMenuRadioItem value="asc" onSelect={(e) => e.preventDefault()}>
										<FaSortAmountUp />
										Ascending
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="desc" onSelect={(e) => e.preventDefault()}>
										<FaSortAmountDownAlt />
										Descending
									</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuGroup>
							{options && options.length > 0 && <DropdownMenuSeparator />}
						</>

						{options && options.length > 0 && (
							<DropdownMenuGroup>
								<DropdownMenuLabel>{sortByLabel}</DropdownMenuLabel>
								<DropdownMenuRadioGroup
									value={value.column}
									onValueChange={(column) => onChange({ ...value, column })}
								>
									{options.map((opt) => {
										const Icon = opt.icon;
										return (
											<DropdownMenuRadioItem
												key={opt.value}
												value={opt.value}
												onSelect={(e) => e.preventDefault()}
											>
												<Icon></Icon>
												{opt.label}
											</DropdownMenuRadioItem>
										);
									})}
								</DropdownMenuRadioGroup>
							</DropdownMenuGroup>
						)}
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export interface FeatureTableAddButtonProps {
	onClick?: () => void;
	label?: string;
	icon?: ReactNode;
	className?: string;
	buttonProps?: React.ComponentProps<typeof Button>;
}

function FeatureTableAddButton({
	onClick,
	label,
	icon = <IoMdAdd />,
	className,
	buttonProps,
}: FeatureTableAddButtonProps) {
	return (
		<Button
			variant="outline"
			onClick={onClick}
			className={cn(label ? "flex gap-1.5" : "", className)}
			{...buttonProps}
		>
			{icon}
			{label && <span>{label}</span>}
		</Button>
	);
}

export interface FeatureTableReloadButtonProps {
	isLoading?: boolean;
	onClick?: () => void;
	className?: string;
}

function FeatureTableReloadButton({
	isLoading = false,
	onClick,
	className,
}: FeatureTableReloadButtonProps) {
	return (
		<ReloadButton variant="outline" isLoading={isLoading} onClick={onClick} className={className} />
	);
}

function FeatureTableContent<T>({
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
			/>
		</div>
	);
}

// Attach subcomponents for dot-notation usage
FeatureTable.Header = FeatureTableHeader;
FeatureTable.Title = FeatureTableTitle;
FeatureTable.Actions = FeatureTableActions;
FeatureTable.Search = FeatureTableSearch;
FeatureTable.Filter = FeatureTableFilter;
FeatureTable.Sort = FeatureTableSort;
FeatureTable.AddButton = FeatureTableAddButton;
FeatureTable.ReloadButton = FeatureTableReloadButton;
FeatureTable.Content = FeatureTableContent;
FeatureTable.Pagination = FeatureTablePagination;

export default FeatureTable;
export {
	FeatureTable,
	FeatureTableHeader,
	FeatureTableTitle,
	FeatureTableActions,
	FeatureTableSearch,
	FeatureTableFilter,
	FeatureTableSort,
	FeatureTableAddButton,
	FeatureTableReloadButton,
	FeatureTableContent,
	FeatureTablePagination,
	type FeatureTablePaginationProps,
};
