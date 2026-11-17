import {
	DropdownMenuCheckboxItem,
	DropdownMenuGroup,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/atoms/dropdown-menu";
import type { DataTableColumn } from "@/components/ui/feature-tables/data-table";
import FeatureTable, {
	type FeatureTableSortOption,
} from "@/components/ui/feature-tables/feature-table";
import { FeatureTablePagination } from "@/components/ui/feature-tables/feature-table-pagination";
import type { FeatureTableSortType } from "@/components/ui/feature-tables/types";
import { useGetProfilesPages } from "@/features/authentication/hooks/useProfiles";
import type {
	UserProfile,
	UserProfileFilterType,
	UserProfileRole,
} from "@/features/authentication/types/ProfileType";
import { useState } from "react";
import { useGetRoles } from "../hooks/useRoles";
import ViewEditAccountDialog from "./ViewEditAccountDialog";
import { Button } from "@/components/ui/atoms/button";
import { useQueryClient } from "@tanstack/react-query";
import { BsAlphabetUppercase } from "react-icons/bs";
import { MdAccessTime } from "react-icons/md";
import { useDebounce } from "@/hooks/use-debounce";

// Columns that appears in the table
const accCols = [
	{ key: "email", label: "Email" },
	{ key: "full_name", label: "Name" },
	{ key: "role_name", label: "Role" },
	{ key: "created_at", label: "Creation Date" },
] as const satisfies DataTableColumn<UserProfile>[];

const accountSortOptions = [
	{ value: "email", label: "Email", icon: BsAlphabetUppercase },
	{ value: "full_name", label: "Name", icon: BsAlphabetUppercase },
	{ value: "role_name", label: "Role", icon: BsAlphabetUppercase },
	{ value: "created_at", label: "Creation Date", icon: MdAccessTime },
] as const satisfies FeatureTableSortOption<UserProfile>[];

const AccountsTable = () => {
	// Simple states for the table
	const [currPage, setCurrPage] = useState<number>(1);
	const [currAccId, setCurrAccId] = useState<UserProfile["id"] | null>(null);

	// Search states and debouncer
	const [searchInput, setSearchInput] = useState<string>("");
	const debouncedSearch = useDebounce({value: searchInput, delay: 300, onDebounce: () => setCurrPage(1)})

	// Filters and sorts
	const [filters, setFilters] = useState<UserProfileFilterType>({ roles: [], search: "" });
	const [sortBy, setsortBy] = useState<FeatureTableSortType<UserProfile>>({
		column: "created_at",
		isAscending: false,
	});

	// Handlers
	const handleFiltersChange = (updates: UserProfileFilterType) => {
		setFilters(updates);
		setCurrPage(1);
	};

	const handleSearchChange = (value: string) => {
		setSearchInput(value);
	}

	const handleSortChange = (updates: FeatureTableSortType<UserProfile>) => {
		setsortBy(updates);
		setCurrPage(1);
	};

	// Queries
	const queryClient = useQueryClient();
	const { isError, isPending, profiles, totalPages, isPlaceholderData, isFetching } =
		useGetProfilesPages({
			page: currPage,
			pageSize: 10,
			sortBy,
			filterBy: {...filters, search: debouncedSearch},
		});
	const { roles } = useGetRoles();

	if (isError) return <div>Error loading accounts</div>;

	return (
		<>
			<FeatureTable className="h-170">
				{/* Table Header */}
				<FeatureTable.Header>
					<FeatureTable.Title>Accounts</FeatureTable.Title>
					<FeatureTable.Actions>
						{/* Search button */}
						<FeatureTable.Search
							value={searchInput}
							onChange={handleSearchChange}
						></FeatureTable.Search>

						{/* Filter button */}
						<AccountsTableFilter
							filters={filters}
							handleFiltersChange={handleFiltersChange}
							roles={roles ?? []}
						></AccountsTableFilter>

						{/* Sort button */}
						<FeatureTable.Sort
							value={sortBy}
							onChange={handleSortChange}
							options={accountSortOptions}
						></FeatureTable.Sort>

						{/* Reload button */}
						<FeatureTable.ReloadButton
							isLoading={isFetching}
							onClick={() => queryClient.invalidateQueries({ queryKey: ["profilesPage"] })}
						/>
					</FeatureTable.Actions>
				</FeatureTable.Header>

				{/* Table Content */}
				<FeatureTable.Content
					data={profiles}
					rowKey={"id"}
					columns={accCols}
					isLoading={isPending || isPlaceholderData}
					renderFeatureActions={(row: UserProfile) => {
						return (
							<AccountsTableActions row={row} setCurrAccId={setCurrAccId}></AccountsTableActions>
						);
					}}
				></FeatureTable.Content>

				{/* Table Pagination */}
				<FeatureTablePagination
					totalPages={totalPages}
					currentPage={currPage}
					onPageChange={setCurrPage}
				></FeatureTablePagination>
			</FeatureTable>

			{/* Table View Edit Modal */}
			{currAccId && (
				<ViewEditAccountDialog
					title={"View & Edit Account"}
					open={true}
					accountId={currAccId}
					onOpenChange={() => setCurrAccId(null)}
				></ViewEditAccountDialog>
			)}
		</>
	);
};
export default AccountsTable;

// The filter dropdown in the table
interface AccountsTableFilterProps {
	roles: UserProfileRole[];
	filters: UserProfileFilterType;
	handleFiltersChange: (updates: UserProfileFilterType) => void;
}

const AccountsTableFilter = ({ filters, handleFiltersChange, roles }: AccountsTableFilterProps) => {
	return (
		<FeatureTable.Filter triggerText="Filter">
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					{roles.length > 0 && (
						<DropdownMenuGroup>
							{roles.map((role) => {
								const isSelected = filters.roles.includes(role.id);

								return (
									<DropdownMenuCheckboxItem
										key={role.id}
										onCheckedChange={() => {
											if (!isSelected) {
												handleFiltersChange({ ...filters, roles: [...filters.roles, role.id] });
											} else {
												handleFiltersChange({
													...filters,
													roles: filters.roles.filter((roleId) => roleId !== role.id),
												});
											}
										}}
										checked={isSelected}
									>
										{role.name}
									</DropdownMenuCheckboxItem>
								);
							})}
						</DropdownMenuGroup>
					)}
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</FeatureTable.Filter>
	);
};

// The action buttons inside of each of the table's rows
const AccountsTableActions = ({
	row,
	setCurrAccId,
}: {
	row: UserProfile;
	setCurrAccId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
	return (
		<div className="flex gap-2">
			<Button onClick={() => setCurrAccId(row.id)}>View / Edit</Button>
		</div>
	);
};
