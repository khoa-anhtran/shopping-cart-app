import { STATUS } from "@/constants/api"
import { COMMUNES_FETCH_FAILED, COMMUNES_FETCH_REQUESTED, COMMUNES_FETCH_SUCCEEDED, PROVINCES_FETCH_FAILED, PROVINCES_FETCH_REQUESTED, PROVINCES_FETCH_SUCCEEDED } from "./actionTypes";
import { Commune, PaymentPayloadAction, PaymentState, Province } from "@/types/payment";

const initialState: PaymentState = {
    communes: [],
    provinces: [],
    shippingAddress: {},
    status: STATUS.IDLE,
    error: null
}

const PaymentReducer = (state = initialState, action: PaymentPayloadAction): PaymentState => {
    switch (action.type) {

        case COMMUNES_FETCH_REQUESTED:
        case PROVINCES_FETCH_REQUESTED: {
            return {
                ...state,
                status: STATUS.LOADING
            };
        }

        case PROVINCES_FETCH_SUCCEEDED: {
            const { provinces } = action.payload as { provinces: Province[] };

            return {
                ...state,
                provinces,
                status: STATUS.SUCCESS
            };
        }

        case COMMUNES_FETCH_SUCCEEDED: {
            const { communes } = action.payload as { communes: Commune[] };

            return {
                ...state,
                communes,
                status: STATUS.SUCCESS
            };
        }

        case COMMUNES_FETCH_FAILED:
        case PROVINCES_FETCH_FAILED: {
            const { message } = action.payload as { message: string };

            return {
                ...state,
                error: message,
                status: STATUS.FAIL
            };
        }


        default:
            return state;
    }
}

export default PaymentReducer