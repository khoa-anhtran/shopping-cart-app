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
    paymentInfo: {
        type: string,
        isPaid: boolean
    }
    status: string,
    error: string | null
}

export type CheckoutPayloadAction = PayloadAction<>

export type ShippingAddressType = z.infer<typeof shippingAddressSchema>;