import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "./components/ui/toast.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<App />
					<Toaster></Toaster>
				</QueryClientProvider>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>,
);
