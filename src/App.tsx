import { Navigate, Outlet, Route, Routes } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import ProductsTable from "./features/inventory/ui/ProductsTable";

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
				<Route element={<DashboardPage />} path="/dashboard">
					<Route index element={<Navigate to="products" replace />}></Route>
					<Route path="products" element={<ProductsTable/>}></Route>
				</Route>
			</Route>
			/* Fallback Routes */
			<Route
				path="/"
				element={
					<Navigate to={"/dashboard"} replace />
				} /* Todo: integrate authentication */
			/>
			<Route
				path="*"
				element={
					<Navigate to={"/dashboard"} replace />
				} /* Todo: integrate authentication */
			/>
		</Routes>
	);
};

export default App;
