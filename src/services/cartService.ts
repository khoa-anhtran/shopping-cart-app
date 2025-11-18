import { CartItem } from "@/types/cart"
import api from "./api"

export const fetchCart = async (userId: number) => {
    const res = await api.get(`/api/carts/${userId}`)

    const data = res.data as { [id: string]: Omit<CartItem, "id"> }
    
    return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
    }))
}

export const putCartItems = async ({ items, userId }: { items: CartItem[]; userId: number; }) => {
    const body = { items: Object.fromEntries(items.map(i => [String(i.id), { quantity: i.quantity, addedAt: i.addedAt }])) }
    await api.put(`/api/carts/${userId}`, body)
}