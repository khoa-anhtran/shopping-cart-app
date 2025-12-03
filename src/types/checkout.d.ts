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
    paymentInfo: PaymentInfo,
    status: string,
    error: string | null
}

export type PaymentInfo = {
    method: string,
    isPaid: boolean
}

export type PlaceOrderPayload = {
    shippingAddress: ShippingAddressType,
    paymentInfo: PaymentInfo,
    items: CartItem,
    isSaved: boolean,
    total: number
}

export type CheckoutPayloadAction = PayloadAction<>

export type ShippingAddressType = z.infer<typeof shippingAddressSchema>;