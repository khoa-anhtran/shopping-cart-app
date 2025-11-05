import { FetchStatus, SyncStatus } from "@/types";
import { notification } from "antd";
import axios, { AxiosError } from "axios";

export function roundTo(n: number, decimals = 2): number {
    const f = 10 ** decimals;
    return Math.round((n + Number.EPSILON) * f) / f;
}

export const isAxiosError = <T = unknown>(e: unknown): e is AxiosError<T> =>
    axios.isAxiosError(e);

type Status = FetchStatus | SyncStatus;

export function notify({ duration = 2, status, error, message }: { status: Status, error?: string | null, message?: string | null, duration?: number }) {
    if (status === "failed" && error) notification.error({ message: error, duration });
    if (status === "succeeded" && message) notification.success({ message, duration });
}
