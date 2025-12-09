export function formatVnd(amount: number | string): string {
    if (amount === null || amount === undefined) return "";

    const value =
        typeof amount === "string"
            ? Number(amount.toString().replace(/[^\d.-]/g, ""))
            : amount;

    if (Number.isNaN(value)) return "";

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);
}
