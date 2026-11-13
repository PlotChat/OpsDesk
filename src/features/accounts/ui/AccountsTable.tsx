import {
	DropdownMenuCheckboxItem,
	DropdownMenuGroup,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableColumn } from "@/components/ui/feature-tables/data-table";
import FeatureTable from "@/components/ui/feature-tables/feature-table";
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
import { Button } from "@/components/ui/button";
import { FeatureTableSkeleton } from "@/components/ui/feature-tables/feature-table-skeleton";
import { useQueryClient } from "@tanstack/react-query";

// Columns that appears in the table
const accCols = [
	{ key: "email", label: "Email" },
	{ key: "full_name", label: "Name" },
	{ key: "role_name", label: "Role" },
	{ key: "created_at", label: "Creation Date" },
] satisfies DataTableColumn<UserProfile>[];

const AccountsTable = () => {
	const queryClient = useQueryClient();

	// States and hooks for the table
	const [currPage, setcurrPage] = useState<number>(1);
	const [search, setSearch] = useState<string>("");
	const [filters, setFilters] = useState<UserProfileFilterType>({ roles: [] });
	const [sortBy, setsortBy] = useState<FeatureTableSortType<UserProfile>>({
		column: "created_at",
		isAscending: false,
	});
	const { isError, isPending, profiles, totalPages, isPlaceholderData, isFetching } =
		useGetProfilesPages({
			page: currPage,
			pageSize: 10,
		});
	const { roles } = useGetRoles();
	const roleNames = roles?.map((r) => r.name);

	// States for the view modal
	const [currAccId, setCurrAccId] = useState<UserProfile["id"] | null>(null);

	// Handler functions for the table
	const handleFiltersChange = (updates: UserProfileFilterType) => {
		setFilters(updates);
	};

	if (isPending) {
		return (
			<FeatureTableSkeleton
				title="Accounts"
				columns={[undefined, undefined, undefined, undefined]}
				toolbar={["search", "filter", "sort"]}
				rowActions={1}
				className="h-170"
			/>
		);
	}
	if (isError) return <div>Error loading accounts</div>;

	return (
		<>
			<FeatureTable className="h-170">
				{/* Table Header */}
				<FeatureTable.Header>
					<FeatureTable.Title>Accounts</FeatureTable.Title>
					<FeatureTable.Actions>
						{/* Search button */}
						<FeatureTable.Search value={search} onChange={setSearch}></FeatureTable.Search>

						{/* Filter button */}
						<AccountsTableFilter
							filters={filters}
							handleFiltersChange={handleFiltersChange}
							roleNames={roleNames}
						></AccountsTableFilter>

						{/* Sort button */}
						<FeatureTable.Sort value={sortBy} onChange={setsortBy}></FeatureTable.Sort>

						{/* Reload button */}
						<FeatureTable.ReloadButton
							isLoading={isFetching}
							onClick={() => queryClient.invalidateQueries({ queryKey: ["productsPage"] })}
						/>
					</FeatureTable.Actions>
				</FeatureTable.Header>

				{/* Table Content */}
				<FeatureTable.Content
					data={profiles}
					rowKey={"id"}
					columns={accCols}
					isLoading={isPlaceholderData}
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
					onPageChange={setcurrPage}
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
	roleNames: UserProfileRole["name"][];
	filters: UserProfileFilterType;
	handleFiltersChange: (updates: UserProfileFilterType) => void;
}

const AccountsTableFilter = ({
	filters,
	handleFiltersChange,
	roleNames,
}: AccountsTableFilterProps) => {
	return (
		<FeatureTable.Filter triggerText="Filter">
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					{roleNames && (
						<DropdownMenuGroup>
							{roleNames.map((r) => (
								<DropdownMenuCheckboxItem
									key={r}
									onCheckedChange={() => {
										const found = filters.roles.find((role) => role === r);

										if (!found) {
											handleFiltersChange({ ...filters, roles: [...filters.roles, r] });
										} else {
											handleFiltersChange({
												...filters,
												roles: filters.roles.filter((role) => role !== found),
											});
										}
									}}
									checked={filters.roles.find((role) => role === r) ? true : false}
								>
									{r}
								</DropdownMenuCheckboxItem>
							))}
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
