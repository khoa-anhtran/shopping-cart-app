export function timeAgo(input: string | Date): string {
    const date = input instanceof Date ? input : new Date(input);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    if (diffMs <= 0) return "just now";

    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) {
        return formatUnit(seconds, "second");
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return formatUnit(minutes, "minute");
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return formatUnit(hours, "hour");
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
        return formatUnit(days, "day");
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
        return formatUnit(weeks, "week");
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
        return formatUnit(months, "month");
    }

    const years = Math.floor(days / 365);
    return formatUnit(years, "year");
}

function formatUnit(value: number, unit: string): string {
    const plural = value === 1 ? unit : `${unit}s`;
    return `${value} ${plural} ago`;
}