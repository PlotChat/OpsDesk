import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGetProduct } from "../hooks/useProducts";

type GetProductItemDialogProps = {
    productId: string,
    onOpenChange?: (isOpen: boolean) => void;
    title: string;
    open?: boolean;
    viewMode?: "edit" | "view";
};

export default function GetProductItemDialog({
    productId,
    title,
    onOpenChange = () => {},
    open,
    // viewMode = "view" FOR LATER USE,
}: GetProductItemDialogProps) {
    const { data: product, isPending, isError, error } = useGetProduct({ id: productId });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>

                     {/* Todo: handle description  */}
                    <DialogDescription>Description Placeholder</DialogDescription>
                </DialogHeader>

                {isPending && <div>Loading...</div>}
                {isError && <div>Error: {error.message}</div>}
                {product && (
                    <div>{product.name}</div>
                )}
            </DialogContent>
        </Dialog>
    );
}