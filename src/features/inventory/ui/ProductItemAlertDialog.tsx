import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import type { Product } from "../api/getProducts";

type FeatureItemAlertDialogProps = {
	featureItem: Product;
	title: string;
	btnTitle: string;
	description: string;
	viewMode: "edit" | "view";
};

function ProductItemAlertDialog({
	featureItem,
	btnTitle,
	title,
	description,
	viewMode = "view",
}: FeatureItemAlertDialogProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger render={<Button variant="outline" />}>
				{btnTitle}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>

				<div>{featureItem.name}</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
export default ProductItemAlertDialog;
