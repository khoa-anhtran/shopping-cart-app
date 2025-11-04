import { AuthPayload, AuthResponse } from "@/pages/auth/reducers"
import { CartItem } from "@/pages/cart/reducers"
import { Product } from "@/pages/products/reducers"

export const fetchProducts = async () => {
    const res = await fetch('/api/products', { credentials: 'include' })

    if (!res.ok) {
        throw new Error(`GET /api/products failed: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    return Object.fromEntries(data.map(({ id, price, thumbnail, title }: Product) => [id, { id, price, thumbnail, title }]))
}

export const fetchCart = async (userId: number) => {
    const res = await fetch(`/api/carts/${userId}`, { credentials: 'include' })

    if (!res.ok) {
        throw new Error(`GET /api/carts/${userId} failed: ${res.status} ${res.statusText}`)
    }

    const data = await res.json() as { items: Omit<CartItem, 'id'>[], id: number }

    return Object.keys(data.items).map(key => ({
        id: Number(key),
        ...data.items[Number(key)]
    }))
}

export const postLogin = async (authPayload: AuthPayload) => {
    const r = await fetch('/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authPayload),
    })

    if (!r.ok) return r.json().then(err => { throw new Error(err) })

    return (await r.json()) as AuthResponse
}

export const postRegister = async (authPayload: AuthPayload) => {
    const r = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authPayload),
    })
    if (!r.ok) return r.json().then(err => { throw new Error(err) })

    return (await r.json()) as AuthResponse
}

export const putCartItems = async ({ items, userId }: { items: CartItem[]; userId: number }) => {
    const body = { items: Object.fromEntries(items.map(i => [String(i.id), { quantity: i.quantity, addedAt: i.addedAt }])) }
    const r = await fetch(`/api/carts/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })

    if (!r.ok) return r.json().then(err => { throw new Error(err) })
}