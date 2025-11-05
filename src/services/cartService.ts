import { CartItem } from "@/pages/cart/reducers"
import api from "./api"

export const fetchCart = async (userId: number) => {
    const res = await api.get(`/api/carts/${userId}`)

    const data = res.data as { items: Omit<CartItem, 'id'>[], id: number }

    return Object.keys(data.items).map(key => ({
        id: Number(key),
        ...data.items[Number(key)]
    }))
}

export const putCartItems = async ({ items, userId, accessToken }: { items: CartItem[]; userId: number; accessToken: string }) => {
    const body = { items: Object.fromEntries(items.map(i => [String(i.id), { quantity: i.quantity, addedAt: i.addedAt }])) }
    const res = await api.put(`/api/carts/${userId}`, {
        body: JSON.stringify(body),
    })
}