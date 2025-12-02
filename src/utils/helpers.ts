import { STATUS } from "@/constants/api";
import { notification } from "antd";
import axios, { AxiosError } from "axios";

export function roundTo(n: number, decimals = 2): number {
    const f = 10 ** decimals;
    return Math.round((n + Number.EPSILON) * f) / f;
}

export const isAxiosError = <T = unknown>(e: unknown): e is AxiosError<T> =>
    axios.isAxiosError(e);

export function notify({ duration = 2, status, message }: { status: string, message?: string | null, duration?: number }) {
    // const { notification } = App.useApp();

    if (status === STATUS.FAIL) notification.error({ message, duration });
    if (status === STATUS.SUCCESS) notification.success({ message, duration });
}

// utils/timeAgo.ts
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
