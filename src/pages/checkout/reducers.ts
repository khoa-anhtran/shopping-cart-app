import { STATUS } from "@/constants/api"
import { COMMUNES_FETCH_FAILED, COMMUNES_FETCH_REQUESTED, COMMUNES_FETCH_SUCCEEDED, ORDER_PLACE_FAILED, ORDER_PLACE_SUCCEEDED, ORDER_PLACED, PROVINCES_FETCH_FAILED, PROVINCES_FETCH_REQUESTED, PROVINCES_FETCH_SUCCEEDED, SHIPPING_ADDRESS_SUBMITED } from "./actionTypes";
import { Commune, CheckoutPayloadAction, CheckoutState, Province, ShippingAddressType } from "@/types/checkout";
import { PAYMENT_TYPE } from "@/constants/payment";

const initialState: CheckoutState = {
    communes: [],
    provinces: [],
    shippingAddress: {
        firstName: "",
        lastName: "",
        addressLine: "",
        isSaved: false
    },
    paymentInfo: {
        isPaid: false,
        method: PAYMENT_TYPE.CASH
    },
    status: STATUS.IDLE,
    error: null
}

const PaymentReducer = (state = initialState, action: CheckoutPayloadAction): CheckoutState => {
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
        case ORDER_PLACE_FAILED:
        case PROVINCES_FETCH_FAILED: {
            const { message } = action.payload as { message: string };

            return {
                ...state,
                error: message,
                status: STATUS.FAIL
            };
        }

        case SHIPPING_ADDRESS_SUBMITED: {
            const { shippingAddress } = action.payload as { shippingAddress: ShippingAddressType };

            return {
                ...state,
                shippingAddress,
            };
        }

        case ORDER_PLACED: {
            return {
                ...state,
                status: STATUS.LOADING
            }
        }

        case ORDER_PLACE_SUCCEEDED: {
            return {
                ...state,
                status: STATUS.SUCCESS
            }
        }

        default:
            return state;
    }
}

export default PaymentReducer