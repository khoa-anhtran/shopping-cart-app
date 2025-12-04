export const PAYMENT_TYPE = {
    CASH: "CASH",
    BANK: "BANK"
} as const

export const PAYMENT_STEP = {
    FILL_SHIPPING_ADDRESS: "FILL_SHIPPING_ADDRESS",
    CHOOSE_PAYMENT: "CHOOSE_PAYMENT",
    REVIEW_ORDER: "REVIEW_ORDER",
    FINISH_ORDER: "FINISH_ORDER"
} as const

export const PAYMENT_STEP_MAP = (step: string) => {
    switch (step) {
        case PAYMENT_STEP.FILL_SHIPPING_ADDRESS:
            return 0
        case PAYMENT_STEP.CHOOSE_PAYMENT:
            return 1
        case PAYMENT_STEP.REVIEW_ORDER:
            return 2
        case PAYMENT_STEP.FINISH_ORDER:
            return 3
    }
}