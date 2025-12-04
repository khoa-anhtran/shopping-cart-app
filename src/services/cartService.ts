import { CartItem } from "@/types/cart"
import api from "./api"

export const fetchCart = async () => {
    const res = await api.get(`/api/carts`)

    const data = res.data as { [id: string]: Omit<CartItem, "itemId"> }

    return Object.keys(data).map(key => ({
        itemId: key,
        ...data[key]
    }))
}

export const putCartItems = async (items: CartItem[]) => {
    const body = {
        items: items.map(item => {
            const { addedAt, itemId, quantity } = item
            return { addedAt, itemId, quantity }
        })
    }
    await api.put(`/api/carts`, body)
}