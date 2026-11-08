import { Navigate, Outlet, Route, Routes } from "react-router";
import Main from "./components/layout/Main";
import ProductsTable from "./features/inventory/ui/ProductsTable";
import OrdersTable from "./features/orders/ui/OrdersTable";

/* Todo: integrate authentication */
const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
	if (!isAuthenticated) {
		return <div>Nope ure not auth'd</div>;
	}

	return <Outlet></Outlet>;
};

const App = () => {
	return (
		<Routes>
			/* Dashboard Routes */
			<Route element={<ProtectedRoute isAuthenticated={true}></ProtectedRoute>}>
				<Route element={<Main />} path="/">
					<Route element={<Navigate to="/products" />} index></Route>
					<Route element={<div>404 Not Found</div>} path="*"></Route>

					<Route element={<ProductsTable></ProductsTable>} path="/products"></Route>
					<Route element={<OrdersTable></OrdersTable>} path="/orders"></Route>
				</Route>
			</Route>

			/* Fallback Routes */
			<Route
				path="*"
				element={<Navigate to={"/register"} replace />} /* Todo: integrate authentication */
			/>
		</Routes>
	);
};

export default App;
