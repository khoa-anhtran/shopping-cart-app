import { STATUS } from "@/constants/api"
import { PROVINCES_FETCH_FAILED, PROVINCES_FETCH_REQUESTED, PROVINCES_FETCH_SUCCEEDED } from "./actionTypes";
import { PaymentPayloadAction, PaymentState, Province } from "@/types/payment";

const initialState: PaymentState = {
    communes: [],
    provinces: [],
    shippingAddress: {},
    status: STATUS.IDLE,
    error: null
}

const PaymentReducer = (state = initialState, action: PaymentPayloadAction): PaymentState => {
    switch (action.type) {
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