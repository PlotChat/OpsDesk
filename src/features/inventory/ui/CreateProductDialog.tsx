import { useState, type SubmitEvent } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@base-ui/react";
import { useCreateProduct } from "../hooks/useProducts";
import type { Category } from "../types/types";
import { CategorySelector } from "./CategorySelector";

type CreateProductDialogProps = {
	productId?: string;
	onOpenChange?: (isOpen: boolean) => void;
	title: string;
	open?: boolean;
};

export default function CreateProductDialog({
	title,
	onOpenChange = () => {},
	open,
}: CreateProductDialogProps) {
	const {
		mutate: createProduct,
		isError,
		error,
		isPending,
	} = useCreateProduct();
	const [name, setName] = useState("");
	const [sku, setSku] = useState("");
	const [price, setPrice] = useState("");
	const [stock, setStock] = useState("");
	const [chosenCategories, setChosenCategories] = useState<Category[]>([]);

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();

		createProduct(
			{
				name,
				sku,
				price: Number(price),
				stock_level: Number(stock),
				categories: chosenCategories,
			},
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				{isError && (
					<div className="text-red-500 text-sm">Error: {error.message}</div>
				)}

				<form onSubmit={handleSubmit}>
					<FieldSet>
						<FieldGroup className="flex flex-col gap-4">
							<Field>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<Input
									id="name"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									autoComplete="off"
									placeholder="e.g. Wireless Mouse"
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="sku">SKU</FieldLabel>
								<Input
									id="sku"
									required
									value={sku}
									onChange={(e) => setSku(e.target.value)}
									autoComplete="off"
									placeholder="SKU-1000"
								/>
							</Field>
							<div className="flex gap-4">
								<Field className="flex-1">
									<FieldLabel htmlFor="price">Price</FieldLabel>
									<Input
										id="price"
										type="number"
										step="0.01"
										required
										min={0}
										value={price}
										onChange={(e) => setPrice(e.target.value)}
										placeholder="99.99"
									/>
								</Field>
								<Field className="flex-1">
									<FieldLabel htmlFor="stock">Stock Level</FieldLabel>
									<Input
										id="stock"
										type="number"
										required
										min={0}
										value={stock}
										onChange={(e) => setStock(e.target.value)}
										placeholder="50"
									/>
								</Field>
							</div>
							<CategorySelector
								chosenCategories={chosenCategories || []}
								onChange={(cValues) => {setChosenCategories(cValues)}}
							/>
						</FieldGroup>
					</FieldSet>

					<div className="mt-6 flex flex-row-reverse gap-2">
						<Button type="submit" disabled={isPending}>
							{isPending ? "Creating..." : "Create Product"}
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={() => onOpenChange(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
