import { CHECKED_OUT, COMMUNES_FETCH_FAILED, COMMUNES_FETCH_REQUESTED, COMMUNES_FETCH_SUCCEEDED, NEXT_STEP, ORDER_PLACE_FAILED, ORDER_PLACE_SUCCEEDED, ORDER_PLACED, PAYMENT_INFO_REQUESTED, PAYMENT_STATUS_UPDATED, PREV_STEP, PROVINCES_FETCH_FAILED, PROVINCES_FETCH_REQUESTED, PROVINCES_FETCH_SUCCEEDED, SHIPPING_ADDRESS_SUBMITED } from "./actionTypes";
import { Commune, PaymentStatus, PlaceOrderPayload, Province, ShippingAddressType } from "@/types/checkout";

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

export const placeOrderSucceeded = (itemIds: string[]) => ({
    type: ORDER_PLACE_SUCCEEDED,
    payload: {
        itemIds
    }
})

export const placeOrderFailed = (message: string) => ({
    type: ORDER_PLACE_FAILED,
    payload: {
        message
    }
})

export const nextStep = () => ({
    type: NEXT_STEP
})

export const prevStep = () => ({
    type: PREV_STEP
})

export const paymentInfoRequested = () => ({
    type: PAYMENT_INFO_REQUESTED,
    payload: {

    }
})

export const paymentStatusUpdated = (status: PaymentStatus) => ({
    type: PAYMENT_STATUS_UPDATED,
    payload: {
        status
    }
})

export const checkedOut = () => ({
    type: CHECKED_OUT
})