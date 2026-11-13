import { useState, type SubmitEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditProduct, useGetProduct } from "../hooks/useProducts";
import type { Category, Product } from "../types/types";
import { CategorySelector } from "./CategorySelector";
import { cn } from "cn";
import { CopyButton } from "@/components/ui/copy-button";

const inputTextStyles =
	"p-2 bg-secondary/30 border rounded-md text-sm min-h-[38px] flex items-center";
const getFieldStyles = (isEdit = false) => {
	return cn(!isEdit ? "p-3 bg-muted/70 rounded-lg" : "");
};

type ViewEditProductItemDialogProps = {
	productId: string;
	onOpenChange?: (isOpen: boolean) => void;
	title: string;
	open?: boolean;
	viewMode?: "edit" | "view";
};

export default function ViewEditProductItemDialog({
	productId,
	title,
	onOpenChange = () => {},
	open,
}: ViewEditProductItemDialogProps) {
	const { data: product, isPending, isError, error } = useGetProduct({ id: productId });

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				{isError && <div className="py-4 text-sm text-red-500">Error: {error.message}</div>}

				{isPending || !product ? (
					<ViewEditProductSkeleton />
				) : (
					<ProductEditForm product={product} onOpenChange={onOpenChange} />
				)}
			</DialogContent>
		</Dialog>
	);
}

function ProductEditForm({
	product,
	onOpenChange,
}: {
	product: Product;
	onOpenChange: (isOpen: boolean) => void;
}) {
	const { mutate: editProduct, isPending } = useEditProduct();
	const [isEdit, setIsEdit] = useState<boolean>(false);

	// Initializes directly from the product object when its done fetching
	const [name, setName] = useState(product.name || "");
	const [sku, setSku] = useState(product.sku || "");
	const [price, setPrice] = useState<number | "">(product.price || "");
	const [stock, setStock] = useState<number | "">(product.stock_level || "");
	const [chosenCategories, setChosenCategories] = useState<Category[]>(product.categories || []);
	const [localError, setLocalError] = useState<string>("");

	const isInputValid = [name, sku, price, stock].every((i) => {
		if (typeof i === "string") {
			return i.trim() !== "";
		} else if (typeof i === "number") {
			return i >= 0;
		}
		return false;
	});

	const categoriesChanged =
		chosenCategories.length !== (product.categories?.length || 0) ||
		chosenCategories.some((chosen) =>
			product.categories?.find((original: Category) => original.id !== chosen.id),
		);

	const hasInputChanged =
		name !== product.name ||
		sku !== product.sku ||
		price !== product.price ||
		stock !== product.stock_level ||
		categoriesChanged;

	const resetInputs = () => {
		setName(product.name || "");
		setSku(product.sku || "");
		setPrice(product.price || "");
		setStock(product.stock_level || "");
		setChosenCategories(product.categories || []);
		setLocalError("");
	};

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		if (!hasInputChanged) {
			setIsEdit(false);
			setLocalError("");
			return;
		}

		if (!isInputValid) {
			setLocalError("Invalid input for product edit fields");
			return;
		}

		editProduct(
			{
				id: product.id,
				updates: {
					name,
					sku,
					price,
					stock_level: stock,
					categories: chosenCategories,
				},
			},
			{
				onSuccess: () => {
					// Only switch to back to view mode AFTER success
					setIsEdit(false);
					setLocalError("");
				},
				onError: () => {
					setLocalError("Error when saving changes");
				},
			},
		);

		setIsEdit(false);
		setLocalError("");
	};

	return (
		<form onSubmit={handleSubmit}>
			<FieldSet>
				<FieldGroup className="flex flex-col gap-4 mt-2">
					{/* Error space */}
					<div className="h-5 -mt-2.5 -mb-2 text-red-500">{localError}</div>

					<Field className={getFieldStyles(isEdit)}>
						<div className="flex justify-between">
							<FieldLabel>Id</FieldLabel>
							<CopyButton value={product.id}></CopyButton>
						</div>
						{isEdit ? (
							<Input className={inputTextStyles} value={product.id || ""} disabled={true} />
						) : (
							<div className="text-md">{product.id}</div>
						)}
					</Field>

					<Field className={getFieldStyles(isEdit)}>
						<div className="flex justify-between">
							<FieldLabel>Name</FieldLabel>
							<CopyButton value={name}></CopyButton>
						</div>
						{isEdit ? (
							<Input
								className={inputTextStyles}
								value={name}
								disabled={!isEdit || isPending}
								onChange={(e) => setName(e.currentTarget.value)}
							/>
						) : (
							<div className="text-md">{name}</div>
						)}
					</Field>

					<Field className={getFieldStyles(isEdit)}>
						<div className="flex justify-between">
							<FieldLabel>SKU</FieldLabel>
							<CopyButton value={sku}></CopyButton>
						</div>
						{isEdit ? (
							<Input
								className={inputTextStyles}
								value={sku}
								disabled={!isEdit || isPending}
								onChange={(e) => setSku(e.currentTarget.value)}
							/>
						) : (
							<div className="text-md">{sku}</div>
						)}
					</Field>

					<div className="flex gap-4">
						<Field className={getFieldStyles(isEdit)}>
							<div className="flex justify-between">
								<FieldLabel>Price</FieldLabel>
								<CopyButton value={String(price)}></CopyButton>
							</div>
							{isEdit ? (
								<Input
									className={inputTextStyles}
									type="number"
									step="0.01"
									min="0"
									value={price}
									disabled={!isEdit || isPending}
									onChange={(e) => setPrice(Number(e.currentTarget.value))}
								/>
							) : (
								<div className="text-md">{price}</div>
							)}
						</Field>

						<Field className={getFieldStyles(isEdit)}>
							<div className="flex justify-between">
								<FieldLabel>Stock</FieldLabel>
								<CopyButton value={String(stock)}></CopyButton>
							</div>
							{isEdit ? (
								<Input
									className={inputTextStyles}
									type="number"
									min={"0"}
									value={stock}
									disabled={!isEdit || isPending}
									onChange={(e) => setStock(Number(e.currentTarget.value))}
								/>
							) : (
								<div className="text-md">{stock}</div>
							)}
						</Field>
					</div>

					<CategorySelector
						chosenCategories={chosenCategories}
						onChange={setChosenCategories}
						disabled={!isEdit}
					/>
				</FieldGroup>
			</FieldSet>

			{/* Bottom actions */}
			<div className="mt-6 gap-2 flex justify-end">
				<Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
					Close
				</Button>

				{!isEdit ? (
					<Button type="button" variant="default" onClick={() => setIsEdit(true)}>
						Edit
					</Button>
				) : (
					<>
						<Button
							type="button"
							variant="destructive"
							onClick={() => {
								resetInputs();
								setIsEdit(false);
							}}
						>
							Cancel
						</Button>
						<Button className={"w-30"} type="submit" variant="default">
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
					</>
				)}
			</div>
		</form>
	);
}

function ViewEditProductSkeleton() {
	return (
		<FieldSet>
			<FieldGroup className="flex flex-col gap-4 mt-6">
				<Field>
					<div className={`${getFieldStyles()} h-19 animate-pulse`}></div>
				</Field>
				<Field>
					<div className={`${getFieldStyles()} h-19 animate-pulse`}></div>
				</Field>
				<Field>
					<div className={`${getFieldStyles()} h-19 animate-pulse`}></div>
				</Field>
				<div className="flex gap-4">
					<Field className="flex-1">
						<div className={`${getFieldStyles()} h-19 animate-pulse`}></div>
					</Field>
					<Field className="flex-1">
						<div className={`${getFieldStyles()} h-19 animate-pulse`}></div>
					</Field>
				</div>
				<Field>
					<div className={`${getFieldStyles()} h-15 animate-pulse`}></div>
				</Field>
			</FieldGroup>
			<div className="mt-2 gap-2 flex justify-end">
				<Button type="button" disabled variant="secondary" className={"animate-pulse w-15"}></Button>
				<Button type="button" disabled variant="default" className={"animate-pulse w-15"}></Button>
			</div>
		</FieldSet>
	);
}
