import { Button } from "@/components/ui/atoms/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/atoms/dialog";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/atoms/field";
import { Input } from "@/components/ui/atoms/input";
import { Separator } from "@/components/ui/atoms/separator";
import { getProductsBySku } from "@/features/inventory/api/getProducts";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "cn";
import { useState, type SubmitEvent } from "react";
import { IoMdAdd } from "react-icons/io";
import type { CreateOrderItemType } from "../types/types";
import { CreateOrderItemsTable } from "./OrderItemsTable";
import { Badge } from "@/components/ui/atoms/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/atoms/input-group";
import { MdEmail } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetProfileByEmail } from "@/features/authentication/hooks/useProfiles";
import { FaCheck, FaPen } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { BsDot } from "react-icons/bs";
import { useCreateOrder } from "../hooks/useOrders";
import { toast } from "@/components/ui/atoms/toast";
import { IoReceiptOutline } from "react-icons/io5";

const CreateOrderDialog = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (isOpen: boolean) => void;
}) => {
	// Inputs for the form
	const [skuInput, setSkuInput] = useState("");
	const [qtyInput, setQtyInput] = useState<number>(1);
	const [name, setName] = useState("");
	const [email, setEmailInput] = useState("");
	const emailInput = email.trim(); // Cleans the input
	const debouncedEmail = useDebounce({ value: emailInput, delay: 1000 });

	// States for the form
	const [localError, setLocalError] = useState("");
	const [orderItems, setOrderItems] = useState<CreateOrderItemType[]>([]);
	let totalPrice = orderItems.reduce((prev, curr) => prev + curr.unit_price * curr.quantity, 0);
	totalPrice = Math.round(totalPrice * 100) / 100;

	// Handlers
	const handleRemoveItem = (orderItem: CreateOrderItemType) => {
		setOrderItems((prev) => prev.filter((oi) => oi.product_id !== orderItem.product_id));
	};

	const handleChangeItemQty = (orderItem: CreateOrderItemType, value: number) => {
		setOrderItems((prev) =>
			prev.map((oi) => (oi.product_id === orderItem.product_id ? { ...oi, quantity: value } : oi)),
		);
	};

	// Queries and Mutations
	const queryClient = useQueryClient();
	const { profile, isFetching, isError, error } = useGetProfileByEmail({
		email: debouncedEmail,
		enabled: debouncedEmail !== "",
	});
	const { createOrder, isPending: isOrderCreating } = useCreateOrder();

	const handleAddSku = async (sku: string) => {
		setLocalError("");

		if (!sku) {
			setLocalError("Empty sku");
			return;
		}

		try {
			const product = await queryClient.query({
				queryFn: () => getProductsBySku({ sku }),
				queryKey: ["product", sku],
			});

			const existing = orderItems.find((o) => o.product_id === product.id);

			// Business checks
			if (qtyInput === 0) {
				setLocalError("Product quantity is 0");
				return;
			}
			if ((existing?.quantity ?? 0) + qtyInput > Number(product.stock_level)) {
				setLocalError("Product stock level is below quantity input");
				return;
			}
			if (product.stock_level === 0) {
				setLocalError("Pproduct stock level is 0");
				return;
			}

			// Committing product by saving it or increase its quantity if it already exists
			if (existing) {
				setOrderItems((prev) => [
					...prev.filter((oi) => oi.product_id !== existing.product_id),
					{ ...existing, quantity: existing.quantity + qtyInput },
				]);
			} else {
				const newOI: CreateOrderItemType = {
					product_id: product.id,
					name: product.name,
					quantity: qtyInput,
					unit_price: Number(product.price),
				};
				setOrderItems((prev) => [...prev, newOI]);
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				setLocalError(error.message);
			} else {
				setLocalError("Error adding product");
			}
			return;
		}
	};

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();

		if (!emailInput || !name) {
			setLocalError("No user email and/or customer name provided");
			return;
		}

		if (!profile) {
			setLocalError("No user found with the provided information");
			return;
		}

		if (orderItems.length === 0) {
			setLocalError("No products were added to the order.");
			return;
		}

		setLocalError("");

		createOrder(
			{ customer_name: name, customer_id: profile?.id, status: "Pending", orderItems },
			{
				onError: (error) => {
					setLocalError(error.message);
				},
				onSuccess: () => {
					toast.add({
						title: (
							<div className="flex gap-1 items-center">
								<IoReceiptOutline/>
								<span>Create Order</span>
							</div>
						),
						description: (
							<div className="flex gap-1 items-center">
								<FaCheck className="text-emerald-500" />
								<span>Order created successfully!</span>
							</div>
						),
					});
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={"md:max-w-150"}>
				<DialogHeader>
					<DialogTitle>Create Order</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<FieldSet>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="create-order-user-email">User Email</FieldLabel>
								<InputGroup>
									<InputGroupInput
										value={emailInput}
										onChange={(e) => setEmailInput(e.currentTarget.value)}
										placeholder="johnmail@mail.com"
										id="create-order-user-email"
										required
									/>
									<InputGroupAddon>
										<MdEmail />
									</InputGroupAddon>
									<InputGroupAddon align={"inline-end"}>
										{isFetching ? (
											<CgSpinner className="animate-spin text-primary" />
										) : (
											<>
												{isError && <RxCross2 className="text-red-600" />}
												{!isError && profile && <FaCheck className="text-emerald-500" />}
											</>
										)}
									</InputGroupAddon>
								</InputGroup>
							</Field>
							<div className="h-5 -mt-5 -mb-4">
								{isError && debouncedEmail === emailInput && (
									<h2 className="flex text-red-500 text-xs items-center">
										<BsDot className="text-xl" /> {error.message}
									</h2>
								)}
							</div>
							<Field>
								<FieldLabel htmlFor="create-order-customer-name">Customer Name</FieldLabel>
								<InputGroup>
									<InputGroupInput
										value={name}
										onChange={(e) => setName(e.currentTarget.value)}
										placeholder="John Customer"
										id="create-order-customer-name"
										required
									/>
									<InputGroupAddon>
										<FaPen className="size-3" />
									</InputGroupAddon>
								</InputGroup>
							</Field>
							<FieldSeparator></FieldSeparator>
						</FieldGroup>
						<FieldGroup>
							<Field className="flex flex-col h-97 gap-4">
								<div className="flex flex-col flex-2 gap-2">
									<FieldLabel className="mb-2">Order Items</FieldLabel>
									<div className="flex gap-2 items-center">
										<FieldLabel>SKU</FieldLabel>
										<Input
											value={skuInput}
											onChange={(e) => setSkuInput(e.currentTarget.value)}
											placeholder="SKU-EX..."
											className="flex-3"
										/>
										<Separator orientation="vertical" />
										<FieldLabel>Qty</FieldLabel>
										<Input
											value={qtyInput}
											onChange={(e) => setQtyInput(Number(e.currentTarget.value))}
											placeholder="99..."
											className="flex-1"
											type="number"
											min={1}
											max={999}
										/>
										<Separator orientation="vertical" />
										<Button
											type="button"
											onClick={() => handleAddSku(skuInput)}
											className="aspect-square"
										>
											<IoMdAdd />
										</Button>
									</div>
								</div>

								<div
									className={cn(
										"w-full p-2 bg-muted rounded-2xl border-border border h-full flex flex-col gap-2",
										orderItems.length === 0 && "justify-center items-center",
									)}
								>
									{orderItems.length == 0 ? (
										// Empty state when no order items are added
										<h2 className="text-foreground/50 text-center">No Order Items added yet.</h2>
									) : (
										<>
											{/* Render added order items */}
											<div className="w-full overflow-scroll">
												<CreateOrderItemsTable
													containerClassName={"w-full overflow-scroll h-59 rounded-2xl"}
													onRemoveItem={handleRemoveItem}
													onChangeItemQty={handleChangeItemQty}
													data={orderItems}
												/>
											</div>

											<div className="mx-1 flex justify-between border border-border px-3 py-2.5 rounded-2xl">
												<h3>Total Price:</h3>
												<Badge variant={"success"}>{`$${totalPrice}`}</Badge>
											</div>
										</>
									)}
								</div>
							</Field>
						</FieldGroup>
					</FieldSet>

					<div className="h-10 my-2 ms-1">
						{localError && (
							<h2 className="flex text-red-500">
								<BsDot className="text-xl" /> {localError}
							</h2>
						)}
					</div>
					<div className="flex flex-row-reverse gap-2 mt-2">
						<Button type="submit" className={"w-19.5"} disabled={isOrderCreating}>
							{isOrderCreating ? "Saving..." : "Submit"}
						</Button>
						<Button type="button" variant={"secondary"} onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
export default CreateOrderDialog;
