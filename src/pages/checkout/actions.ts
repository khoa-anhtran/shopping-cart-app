import { COMMUNES_FETCH_FAILED, COMMUNES_FETCH_REQUESTED, COMMUNES_FETCH_SUCCEEDED, ORDER_PLACE_FAILED, ORDER_PLACE_SUCCEEDED, ORDER_PLACED, PROVINCES_FETCH_FAILED, PROVINCES_FETCH_REQUESTED, PROVINCES_FETCH_SUCCEEDED, SHIPPING_ADDRESS_SUBMITED } from "./actionTypes";
import { Commune, PlaceOrderPayload, Province, ShippingAddressType } from "@/types/checkout";

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

export const fetchCommunesRequested = (provinceCode: string) => ({
    type: COMMUNES_FETCH_REQUESTED,
    payload: {
        provinceCode
    }
});

export const fetchCommunesSucceeded = (communes: Commune[]) => ({
    type: COMMUNES_FETCH_SUCCEEDED,
    payload: {
        communes
    }
});

export const fetchCommunesFailed = (message: string) => ({
    type: COMMUNES_FETCH_FAILED,
    payload: {
        message
    }
});

export const shippingAddressSubmited = (shippingAddress: ShippingAddressType) => ({
    type: SHIPPING_ADDRESS_SUBMITED,
    payload: {
        shippingAddress
    }
})

export const placeOrder = (data: PlaceOrderPayload) => ({
    type: ORDER_PLACED,
    payload: {
        data
    }
})

export const placeOrderSucceeded = () => ({
    type: ORDER_PLACE_SUCCEEDED,
})

export const placeOrderFailed = (message: string) => ({
    type: ORDER_PLACE_FAILED,
    payload: {
        message
    }
}) 