export function formatIdr(amount: number): string {
	const formattedAmount = new Intl.NumberFormat("id-ID", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);

	return `Rp${formattedAmount.replace(/,/g, ".")}`;
}
