import { Navigate, Outlet, Route, Routes } from "react-router";
import Main from "./components/layout/Main";
import ProductsTable from "./features/inventory/ui/ProductsTable";
import OrdersTable from "./features/orders/ui/OrdersTable";
import { SigninForm, SignupForm } from "./features/authentication/ui/AuthForm";
import AuthPage from "./pages/AuthPage";
import useAuthContext from "./features/authentication/hooks/useAuthContext";
import DashboardPage from "./pages/DashboardPage";

const ProtectedRoute = () => {
	const { user, isLoading } = useAuthContext();

	if (isLoading) return <div>Loading...</div>;
	if (!user) {
		return <Navigate to="/auth/signin" />;
	}

	return <Outlet></Outlet>;
};

const PublicRoute = () => {
	const { user, isLoading } = useAuthContext();

	if (isLoading) return <div>Loading...</div>;

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
};

const App = () => {
	return (
		<Routes>
			/* Authenticated Routes */
			<Route element={<ProtectedRoute />}>
				/* Dashboard */
				<Route element={<Main />} path="/dashboard">
					<Route element={<DashboardPage/>}>
						<Route element={<Navigate to="/dashboard/products" />} index></Route>
						<Route element={<div>404 Not Found</div>} path="*"></Route>
						<Route element={<ProductsTable></ProductsTable>} path="/dashboard/products"></Route>
						<Route element={<OrdersTable></OrdersTable>} path="/dashboard/orders"></Route>
					</Route>
				</Route>
			</Route>
			/* True public routes (Guest only) */
			<Route element={<PublicRoute />}>
				<Route element={<AuthPage />} path="/auth">
					<Route element={<Navigate to="/auth/signin" />} index></Route>
					<Route element={<SigninForm />} path={"/auth/signin"}></Route>
					<Route element={<SignupForm />} path={"/auth/signup"}></Route>
				</Route>
			</Route>
			/* Fallback Routes */
			<Route path="*" element={<Navigate to={"/"} replace />} />
			<Route path="/" element={<Navigate to={"/auth"} replace />} />
		</Routes>
	);
};

export default App;
