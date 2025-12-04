import { STATUS } from "@/constants/api"
import { COMMUNES_FETCH_FAILED, COMMUNES_FETCH_REQUESTED, COMMUNES_FETCH_SUCCEEDED, NEXT_STEP, ORDER_PLACE_FAILED, ORDER_PLACE_SUCCEEDED, ORDER_PLACED, PAYMENT_STATUS_UPDATED, PREV_STEP, PROVINCES_FETCH_FAILED, PROVINCES_FETCH_REQUESTED, PROVINCES_FETCH_SUCCEEDED, SHIPPING_ADDRESS_SUBMITED } from "./actionTypes";
import { Commune, CheckoutPayloadAction, CheckoutState, Province, ShippingAddressType, PaymentStatus } from "@/types/checkout";
import { PAYMENT_STEP, PAYMENT_TYPE } from "@/constants/payment";

const initialState: CheckoutState = {
    communes: [],
    provinces: [],
    shippingAddress: {
        firstName: "",
        lastName: "",
        addressLine: "",
        isSaved: false
    },
    currentStep: PAYMENT_STEP.FILL_SHIPPING_ADDRESS,
    paymentStatus: {
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
                currentStep: PAYMENT_STEP.FINISH_ORDER,
                status: STATUS.SUCCESS
            }
        }

        case NEXT_STEP: {
            const nextStep =
                state.currentStep === PAYMENT_STEP.FILL_SHIPPING_ADDRESS
                    ? PAYMENT_STEP.CHOOSE_PAYMENT
                    : PAYMENT_STEP.REVIEW_ORDER

            return {
                ...state,
                currentStep: nextStep
            }
        }

        case PREV_STEP: {
            const prevStep =
                state.currentStep === PAYMENT_STEP.REVIEW_ORDER
                    ? PAYMENT_STEP.CHOOSE_PAYMENT
                    : PAYMENT_STEP.FILL_SHIPPING_ADDRESS

            return {
                ...state,
                currentStep: prevStep
            }
        }

        case PAYMENT_STATUS_UPDATED: {
            const { status } = action.payload as { status: PaymentStatus };

            return {
                ...state,
                paymentStatus: status
            }
        }

        default:
            return state;
    }
}

export default PaymentReducer