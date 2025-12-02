import { PROVINCES_FETCH_FAILED, PROVINCES_FETCH_REQUESTED, PROVINCES_FETCH_SUCCEEDED } from "./actionTypes";
import { Province } from "@/types/payment";

export const fetchProvincesRequested = () => ({
    type: PROVINCES_FETCH_REQUESTED,
});

export const fetchProvincesSucceeded = (provinces: Province[]) => ({
    type: PROVINCES_FETCH_SUCCEEDED,
    payload: {
        provinces
    }
});

export const fetchProvincesFailed = (message: string) => ({
    type: PROVINCES_FETCH_FAILED,
    payload: {
        message
    }
});