import { PlaceOrderPayload } from "@/types"
import api from "./api"

export const fetchOrders = async () => {
    const res = await api.get(`/api/orders`)

    return res.data
}

export const postOrder = async (body: PlaceOrderPayload) => {
    const res = await api.post(`/api/orders`, body)

    return res.data
}