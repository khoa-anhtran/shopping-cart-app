import { PayloadAction } from "."

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

export type PaymentState = {
    provinces: Province[],
    communes: Commune[],
    shippingAddress: {},
    status: string,
    error: string | null
}

export type PaymentPayloadAction = PayloadAction<>