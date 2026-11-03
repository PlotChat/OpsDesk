import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RxCross2 } from "react-icons/rx";
import type { Category } from "../types/types";
import { useGetCategories } from "../hooks/useCategories";

interface CategorySelectorProps {
	chosenCategories: Category[];
	onChange: (categories: Category[]) => void;
	disabled?: boolean;
}

export function CategorySelector({
	chosenCategories,
	onChange,
	disabled = false,
}: CategorySelectorProps) {
	const { categories } = useGetCategories();

	// Only show categories that haven't been selected yet
	const availableCategories = categories?.filter(
		(c) => !chosenCategories.some((chosen) => chosen.id === c.id),
	);

	const handleSelect = (idValue: string | null) => {
		if (!idValue) return;

		const selected =
			categories?.find((c) => c.id === idValue)
		const isRepeatingCategory = chosenCategories.find((c) => c.id === idValue);

		if (selected && !isRepeatingCategory) {
			onChange([...chosenCategories, selected]);
		}
	};

	const handleRemove = (idToRemove: string) => {
		onChange(chosenCategories.filter((c) => c.id !== idToRemove));
	};

	return (
		<Field>
			<FieldLabel>Categories</FieldLabel>

			{/* Hide the dropdown entirely if disabled */}
			{!disabled && (
				<Select value="" onValueChange={handleSelect} disabled={disabled}>
					<SelectTrigger className="w-full" disabled={availableCategories.length <= 0}>
						<SelectValue placeholder={availableCategories.length > 0 ? "Add a category..." : "All categories added" }/>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{availableCategories.map((c) => (
								<SelectItem key={c.id} value={c.id}>
									{c.name}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			)}

			{/* Always show the chosen categories */}
			<div className="flex flex-wrap gap-2 mt-2">
				{chosenCategories.length === 0 && disabled && (
					<span className="text-sm text-muted-foreground">No categories</span>
				)}
				{chosenCategories.map((c) => (
					<Badge
						key={c.id}
						variant="secondary"
						className="flex items-center gap-1"
					>
						<span>{c.name}</span>
						{!disabled && (
							<button
								type="button"
								onClick={() => handleRemove(c.id)}
								className="text-muted-foreground hover:text-foreground focus:outline-none"
							>
								<RxCross2 className="h-3 w-3" />
							</button>
						)}
					</Badge>
				))}
			</div>
		</Field>
	);
}
