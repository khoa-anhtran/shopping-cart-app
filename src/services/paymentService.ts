import { ShippingAddressType } from "@/types/checkout"
import api from "./api"

export const fetchShippingAddress = async (): Promise<Omit<ShippingAddressType, "isSaved">> => {
    const res = await api.get(`api/payment/shipping-address`)

    return res.data.shippingAddress
}