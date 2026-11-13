import { Navigate, Outlet, Route, Routes } from "react-router";
import DashboardMain from "./components/layout/DashboardMain";
import ProductsTable from "./features/inventory/ui/ProductsTable";
import OrdersTable from "./features/orders/ui/OrdersTable";
import { AuthForm } from "./features/authentication/ui/AuthForm";
import AuthPage from "./pages/AuthPage";
import useAuthContext from "./features/authentication/hooks/useAuthContext";
import DashboardPage from "./pages/DashboardPage";
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/ProfilePage";
import AccountsTable from "./features/accounts/ui/AccountsTable";

// Only staff routing
const ProtectedRoute = () => {
	const { user, userProfile, isLoading } = useAuthContext();

	if (isLoading) return null;

	// If they are not logged in, fallback to default route
	if (!user) {
		return <Navigate to="/" />;
	}

	// If they are logged in but not a staff, take them to home
	if (user && userProfile && !["admin", "staff"].includes(userProfile.role_name)) {
		return <Navigate to="/home" />;
	}

	return <Outlet></Outlet>;
};

// Only Authenticated users routing
const AuthenticatedRoute = () => {
	const { user, userProfile, isLoading } = useAuthContext();

	if (isLoading) return null;

	if (!isLoading && (!user || !userProfile)) {
		return <Navigate to="/home" />;
	}

	return <Outlet></Outlet>;
};

// Only Guests routing
const PublicRoute = () => {
	const { userProfile, isLoading } = useAuthContext();

	// Only hold the screen blank if a session exists and we're waiting on their role
	if (isLoading) return null;

	if (userProfile?.role_name === "admin" || userProfile?.role_name === "staff") {
		return <Navigate to="/dashboard" replace />;
	}

	if (userProfile?.role_name === "customer") {
		return <Navigate to="/home" replace />;
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
						<Route element={<AccountsTable></AccountsTable>} path="/dashboard/accounts"></Route>
					</Route>
				</Route>
			</Route>
			/* Authenticated users Routes */
			<Route element={<AuthenticatedRoute />}>
				<Route element={<ProfilePage></ProfilePage>} path="/profile"></Route>
			</Route>
			/* Guest only routes */
			<Route element={<PublicRoute />}>
				<Route element={<AuthPage />} path="/auth">
					<Route element={<Navigate to="/auth/signin" />} index></Route>
					<Route element={<AuthForm variant="signin"/>} path={"/auth/signin"}></Route>
					<Route element={<AuthForm variant="signup" />} path={"/auth/signup"}></Route>
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
