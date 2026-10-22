import ProductsTable from "@/features/inventory/ui/ProductsTable";
import OrdersTable from "@/features/orders/ui/OrdersTable";

const InventoryPage = () => {
	return (
		<>
			<ProductsTable></ProductsTable>

			<hr></hr>

			<OrdersTable></OrdersTable>
		</>
	);
};
export default InventoryPage;
