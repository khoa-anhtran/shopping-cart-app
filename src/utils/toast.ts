import { STATUS } from "@/constants";
import { notification } from "antd";

export function notify({ duration = 2, status, message }: { status: string, message?: string | null, duration?: number }) {
    if (status === STATUS.FAIL) notification.error({ title: message, duration });
    if (status === STATUS.SUCCESS) notification.success({ title: message, duration });
}


