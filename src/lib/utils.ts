export { cn } from "cn";

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

export const formatCurrency = (value: number | string | null | undefined) => {
	if (value === null || value === undefined || value === "") return "—";

	const amount = Number(value);
	return Number.isFinite(amount) ? currencyFormatter.format(amount) : "—";
};

export const formatTimeToDMY = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-GB");
};

export const getPageRange = (page: number, pageSize: number) => {
	const from = (page - 1) * pageSize;
	const to = page * pageSize - 1;

	return { from, to };
};

export const calcTotalPages = (count: number | null, pageSize: number) => {
	const totalPages = count !== null ? Math.ceil(count / pageSize) : null;

    return totalPages;
};
