import { type DataTableColumn } from "@/components/ui/feature-tables/data-table";
import FeatureTable from "@/components/ui/feature-tables/feature-table";
import { toast } from "@/components/ui/toast";
import { IoMdAdd } from "react-icons/io";
import type { Product, ProductFilterType, SortableProductColumns } from "../types/types";
import { useDeleteProduct, useGetProductsPage } from "../hooks/useProducts";
import { useState } from "react";
import ViewEditProductItemDialog from "./ViewEditProductItemDialog";
import { FeatureTablePagination } from "@/components/ui/feature-tables/feature-table-pagination";
import CreateProductDialog from "./CreateProductDialog";
import { useQueryClient } from "@tanstack/react-query";
import ReloadButton from "@/components/ui/reload-button";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BiSortAlt2 } from "react-icons/bi";
import { IoFilter, IoPricetagsOutline, IoSearch } from "react-icons/io5";
import { useGetCategories } from "../hooks/useCategories";
import { MdAccessTime, MdOutlineCategory } from "react-icons/md";
import { BsAlphabetUppercase } from "react-icons/bs";
import { FaSortAmountDownAlt, FaSortAmountUp } from "react-icons/fa";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export const ProductsTable = () => {
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Handle sorting, filtering and getting products
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [sortBy, setSortBy] = useState<SortableProductColumns>("date");
    const [filters, setFilters] = useState<ProductFilterType>({
        categories: [],
        maxPrice: Number.MAX_VALUE,
        minPrice: 0,
        name: "",
        sku: "",
    });

    const handleFiltersChange = (filters: ProductFilterType) => {
        if (!filters) return;

        setFilters(filters);
        setCurrentPage(1);
    };

    const handleSortDirChange = (dir: "asc" | "desc") => {
        setSortDir(dir);
        setCurrentPage(1);
    };

    const handleSortByChange = (col: SortableProductColumns) => {
        setSortBy(col);
        setCurrentPage(1);
    };

    const { products, totalPages, isPending, isFetching, isPlaceholderData, isError, error } =
        useGetProductsPage({
            page: currentPage,
            pageSize,
            sortBy: {
                column: (sortBy === "alphabet"
                    ? "name"
                    : sortBy === "date"
                        ? "created_at"
                        : sortBy) as keyof Product,
                isAscending: sortDir === "asc",
            },
            filterBy: filters,
        });

    // View product: When a product id is selected through actions in the table, a modal will appear.
    // To close the modal we make this null (according to conditionals at the end of this component)
    const [currProductId, setCurrProductId] = useState<Product["id"]>("");

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    const productColumns = [
        { key: "sku", label: "SKU", width: "md", truncate: true },
        { key: "name", label: "Name", width: "xl", truncate: true },
        { key: "price", label: "Price" },
        { key: "created_at", label: "Created at" },
    ] satisfies DataTableColumn<Product>[];

    return (
        <div className="mx-auto flex flex-col justify-between">
            {/* The products table */}
            <FeatureTable className="h-170">
                <FeatureTable.Header>
                    <ProductHeaderActions
                        isLoading={isFetching}
                        sortDir={sortDir}
                        sortBy={sortBy}
                        handleSortBy={handleSortByChange}
                        handleSortDir={handleSortDirChange}
                        filters={filters}
                        handleFiltersChange={handleFiltersChange}
                    />
                </FeatureTable.Header>
                
                <FeatureTable.Content
                    data={products || []}
                    columns={productColumns}
                    isLoading={isPlaceholderData}
                    className="h-full"
                    rowKey={"id"}
                    renderFeatureActions={(row: Product) => (
                        <ProductTableActions productId={row.id} onView={() => setCurrProductId(row.id)} />
                    )}
                />

                {/* Pagination navigation */}
                <FeatureTablePagination
                    className="mt-3"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                ></FeatureTablePagination>
            </FeatureTable>

            {/* Modal popup for when viewing a specific product */}
            {currProductId && (
                <ViewEditProductItemDialog
                    productId={currProductId}
                    title={`Product Details`}
                    open={currProductId ? true : false}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setCurrProductId("");
                    }}
                ></ViewEditProductItemDialog>
            )}
        </div>
    );
};

export default ProductsTable;

const ProductTableActions = ({
    productId,
    onView,
}: {
    productId: Product["id"];
    onView: () => void;
}) => {
    const { deleteProduct, isDeleting } = useDeleteProduct();

    return (
        <div className="flex gap-1 justify-center">
            <Button onClick={onView}>View / Edit</Button>
            <Button
                variant="destructive"
                onClick={() => {
                    deleteProduct({ id: productId });
                    toast.add({
                        title: "Product deleted!",
                        description: new Intl.DateTimeFormat().format(),
                    });
                }}
                disabled={isDeleting}
            >
                {isDeleting ? "..." : "Delete"}
            </Button>
        </div>
    );
};

interface ProductHeaderActionsProps {
    isLoading: boolean;
    sortDir: "asc" | "desc";
    handleSortDir: (dir: "asc" | "desc") => void;
    sortBy: SortableProductColumns;
    handleSortBy: (col: SortableProductColumns) => void;
    filters: ProductFilterType;
    handleFiltersChange: (filters: ProductFilterType) => void;
}

const ProductHeaderActions = ({
    isLoading,
    sortDir,
    handleSortDir,
    sortBy,
    handleSortBy,
    filters,
    handleFiltersChange,
}: ProductHeaderActionsProps) => {
    const [isViewCreateModal, setIsViewCreateModal] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const { categories } = useGetCategories();

    return (
        <>
            {/* Title */}
            <div className="flex items-center">
                <h1 className="text-2xl">Products</h1>
            </div>

            <div className="w-full items-center flex gap-2 *:h-9.5">
                {/* Search input */}
                <InputGroup>
                    <InputGroupAddon>
                        <IoSearch className="text-secondary-foreground"></IoSearch>
                    </InputGroupAddon>
                    <InputGroupInput
                        onChange={(e) =>
                            handleFiltersChange({
                                ...filters,
                                name: e.currentTarget.value,
                                sku: e.currentTarget.value,
                            })
                        }
                        className="w-full h-full"
                        placeholder="Name or SKU..."
                    ></InputGroupInput>
                </InputGroup>

                {/* Dropdown Filter Button */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button className="flex gap-1.5" variant="outline">
                                <IoFilter />
                                <span>Filter</span>
                            </Button>
                        }
                    ></DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <MdOutlineCategory></MdOutlineCategory>
                                Categories
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                {categories.map((c) => (
                                    <DropdownMenuCheckboxItem
                                        checked={filters?.categories.includes(c)}
                                        onCheckedChange={() => {
                                            if (!filters?.categories.includes(c)) {
                                                handleFiltersChange({
                                                    ...filters,
                                                    categories: [...filters.categories, c],
                                                });
                                            } else {
                                                handleFiltersChange({
                                                    ...filters,
                                                    categories: [...filters.categories.filter((_c) => _c !== c)],
                                                });
                                            }
                                        }}
                                        key={c.id}
                                    >
                                        {c.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Dropdown Sort Button */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button className="flex gap-0.5" variant="outline">
                                <BiSortAlt2 />
                                <span>Sort</span>
                            </Button>
                        }
                    ></DropdownMenuTrigger>
                    <DropdownMenuContent className={"w-max"} side="bottom" align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Directions</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={sortDir}
                                onValueChange={(value) => handleSortDir(value as "asc" | "desc")}
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
                        <DropdownMenuSeparator></DropdownMenuSeparator>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={sortBy}
                                onValueChange={(value) => handleSortBy(value as SortableProductColumns)}
                            >
                                <DropdownMenuRadioItem value="alphabet" onSelect={(e) => e.preventDefault()}>
                                    <BsAlphabetUppercase />
                                    Alphabet
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="price" onSelect={(e) => e.preventDefault()}>
                                    <IoPricetagsOutline />
                                    Price
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="date" onSelect={(e) => e.preventDefault()}>
                                    <MdAccessTime />
                                    Date
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Add button*/}
                <Button variant="outline" onClick={() => setIsViewCreateModal(true)}>
                    <IoMdAdd />
                </Button>

                {/* Reload button*/}
                <ReloadButton
                    variant="outline"
                    isLoading={isLoading}
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["productsPage"] })}
                ></ReloadButton>
            </div>

            {isViewCreateModal && (
                <CreateProductDialog
                    productId={"a9d0e1c9-4e8f-4862-832a-85211b8334ae"}
                    title={`Create Product`}
                    open={true}
                    onOpenChange={(isOpen: boolean) => {
                        if (!isOpen) setIsViewCreateModal(false);
                    }}
                ></CreateProductDialog>
            )}
        </>
    );
};