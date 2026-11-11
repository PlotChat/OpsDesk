import { type DataTableColumn } from "@/components/ui/feature-tables/data-table";
import FeatureTable from "@/components/ui/feature-tables/feature-table";
import { toast } from "@/components/ui/toast";
import type { Product, ProductFilterType, SortableProductColumns } from "../types/types";
import { useDeleteProduct, useGetProductsPage } from "../hooks/useProducts";
import { useState } from "react";
import ViewEditProductItemDialog from "./ViewEditProductItemDialog";
import CreateProductDialog from "./CreateProductDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
    DropdownMenuCheckboxItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCategories } from "../hooks/useCategories";
import { MdAccessTime, MdOutlineCategory } from "react-icons/md";
import { BsAlphabetUppercase } from "react-icons/bs";
import { IoPricetagsOutline } from "react-icons/io5";

export const ProductsTable = () => {
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [isViewCreateModal, setIsViewCreateModal] = useState<boolean>(false);

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

    const queryClient = useQueryClient();
    const { categories } = useGetCategories();

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

    const sortOptions = [
        { value: "alphabet", label: "Alphabet", icon: <BsAlphabetUppercase /> },
        { value: "price", label: "Price", icon: <IoPricetagsOutline /> },
        { value: "date", label: "Date", icon: <MdAccessTime /> },
    ];

    return (
        <div className="mx-auto flex flex-col justify-between">
            {/* The products table */}
            <FeatureTable className="h-170">
                <FeatureTable.Header>
                    <FeatureTable.Title>Products</FeatureTable.Title>

                    <FeatureTable.Actions>
                        {/* Search input */}
                        <FeatureTable.Search
                            placeholder="Name or SKU..."
                            onChange={(value) =>
                                handleFiltersChange({
                                    ...filters,
                                    name: value,
                                    sku: value,
                                })
                            }
                        />

                        {/* Filter dropdown */}
                        <FeatureTable.Filter>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <MdOutlineCategory />
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
                                                        categories: filters.categories.filter((_c) => _c !== c),
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
                        </FeatureTable.Filter>

                        {/* Sort dropdown */}
                        <FeatureTable.Sort
                            sortDir={sortDir}
                            onSortDirChange={handleSortDirChange}
                            sortBy={sortBy}
                            onSortByChange={(val) => handleSortByChange(val as SortableProductColumns)}
                            options={sortOptions}
                        />

                        {/* Add button */}
                        <FeatureTable.AddButton onClick={() => setIsViewCreateModal(true)} />

                        {/* Reload button */}
                        <FeatureTable.ReloadButton
                            isLoading={isFetching}
                            onClick={() => queryClient.invalidateQueries({ queryKey: ["productsPage"] })}
                        />
                    </FeatureTable.Actions>
                </FeatureTable.Header>

                <FeatureTable.Content
                    data={products}
                    columns={productColumns}
                    isLoading={isPlaceholderData}
                    className="h-full"
                    rowKey={"id"}
                    renderFeatureActions={(row: Product) => (
                        <ProductTableActions productId={row.id} onView={() => setCurrProductId(row.id)} />
                    )}
                />

                {/* Pagination navigation */}
                <FeatureTable.Pagination
                    className="mt-3"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </FeatureTable>

            {/* Modal popup for when viewing a specific product */}
            {currProductId && (
                <ViewEditProductItemDialog
                    productId={currProductId}
                    title="Product Details"
                    open={Boolean(currProductId)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) setCurrProductId("");
                    }}
                />
            )}

            {/* Modal popup for creating a product */}
            {isViewCreateModal && (
                <CreateProductDialog
                    productId="a9d0e1c9-4e8f-4862-832a-85211b8334ae"
                    title="Create Product"
                    open={true}
                    onOpenChange={(isOpen: boolean) => {
                        if (!isOpen) setIsViewCreateModal(false);
                    }}
                />
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
