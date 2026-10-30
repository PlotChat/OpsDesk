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
    viewMode?: "edit" | "view"; // (IDEA) In case we need it in the future
};

export default function GetProductItemDialog({
    productId,
    title,
    onOpenChange = () => {},
    open,
}: GetProductItemDialogProps) {
    // This query is placed here instead of in the parent component for optimization, to reduce alot of fetching on render
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