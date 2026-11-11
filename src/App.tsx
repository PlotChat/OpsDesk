import { Navigate, Outlet, Route, Routes } from "react-router";
import DashboardMain from "./components/layout/DashboardMain";
import ProductsTable from "./features/inventory/ui/ProductsTable";
import OrdersTable from "./features/orders/ui/OrdersTable";
import { SigninForm, SignupForm } from "./features/authentication/ui/AuthForm";
import AuthPage from "./pages/AuthPage";
import useAuthContext from "./features/authentication/hooks/useAuthContext";
import DashboardPage from "./pages/DashboardPage";
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/ProfilePage";

// Only staff routing
const ProtectedRoute = () => {
	const { user, userProfile, isLoading } = useAuthContext();

	if (isLoading) return <div>Loading...</div>;
	if (!user) {
		return <Navigate to="/auth/signin" />;
	}
	if (user && userProfile && !["admin", "staff"].includes(userProfile.role)) {
		return <Navigate to="/home" />;
	}

	return <Outlet></Outlet>;
};

// Only Authenticated users routing
const AuthenticatedRoute = () => {
	const { user, userProfile, isLoading } = useAuthContext();

	if(!isLoading && (!user || !userProfile)){
		return <Navigate to="/home" />;
	}

	return <Outlet></Outlet>;
}

// Only Guests routing
const PublicRoute = () => {
	const { userProfile, isLoading } = useAuthContext();

	if (isLoading) return <div>Loading...</div>;

	switch (userProfile?.role) {
		case "admin":
			return <Navigate to="/dashboard" />;
		case "staff":
			return <Navigate to="/dashboard" />;
		case "customer":
			return <Navigate to="/home" />;
	}

	return <Outlet />;
};

const App = () => {
	return (
		<Routes>
			/* Staff Routes */
			<Route element={<ProtectedRoute />}>
				/* Dashboard */
				<Route element={<DashboardMain />} path="/dashboard">
					<Route element={<DashboardPage />}>
						<Route element={<Navigate to="/dashboard/products" />} index></Route>
						<Route element={<div>404 Not Found</div>} path="*"></Route>
						<Route element={<ProductsTable></ProductsTable>} path="/dashboard/products"></Route>
						<Route element={<OrdersTable></OrdersTable>} path="/dashboard/orders"></Route>
					</Route>
				</Route>
			</Route>

			/* Authenticated users Routes */
			<Route element={<AuthenticatedRoute/>}>
				<Route element={<ProfilePage></ProfilePage>} path="/profile"></Route>
			</Route>

			/* Guest only routes */
			<Route element={<PublicRoute />}>
				<Route element={<AuthPage />} path="/auth">
					<Route element={<Navigate to="/auth/signin" />} index></Route>
					<Route element={<SigninForm />} path={"/auth/signin"}></Route>
					<Route element={<SignupForm />} path={"/auth/signup"}></Route>
				</Route>
			</Route>
			/* Public routes */
			<Route element={<Homepage />} path={"/home"}></Route>
			/* Fallback Routes */
			<Route path="*" element={<Navigate to={"/"} replace />} />
			<Route path="/" element={<Navigate to={"/home"} replace />} />
		</Routes>
	);
};

export default App;
