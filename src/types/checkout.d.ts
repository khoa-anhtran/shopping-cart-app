import { PayloadAction } from "."
import { shippingAddressSchema } from "../pages/checkout/components/ShippingAddress"

export type Commune = {
    code: string,
    name: string,
    englishName: string,
    administrativeLevel: string,
    provinceCode: string,
    provinceName: string,
    decree: string
}

export type Province = {
    code: string,
    name: string,
    englishName: string,
    administrativeLevel: string,
    decree: string
}

export type CheckoutState = {
    provinces: Province[],
    communes: Commune[],
    shippingAddress: ShippingAddressType,
    currentStep: string,
    paymentInfo?: PaymentInfo,
    paymentStatus: PaymentStatus,
    status: string,
    error: string | null
}

export type PaymentStatus = {
    method: string,
    isPaid: boolean
}

export type PaymentInfo = {
    bin: string,
    checkoutUrl: string,
    accountNumber: string,
    accountName: string,
    amount: number,
    description: string,
    orderCode: number,
    qrCode: string
}

export type PlaceOrderPayload = {
    shippingAddress: ShippingAddressType,
    paymentStatus: PaymentStatus,
    items: CartItem,
    isSaved: boolean,
    total: number
}

export type CheckoutPayloadAction = PayloadAction<>

export type ShippingAddressType = z.infer<typeof shippingAddressSchema>;