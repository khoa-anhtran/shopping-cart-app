import { AuthPayload, AuthResponse } from "@/pages/auth/reducers"
import { CartItem } from "@/pages/cart/reducers"
import { Product } from "@/pages/products/reducers"

export const postRefreshToken = async () => {
    const res = await fetch("/auth/refresh", {
        method: 'POST',
    })

    if (!res.ok) return res.json().then(err => { throw new Error(err.message) })

    return (await res.json()) as AuthResponse

}

export const postLogin = async (authPayload: AuthPayload) => {
    const r = await fetch('/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authPayload),
    })

    if (!r.ok) return r.json().then(err => { throw new Error(err.message) })

    return (await r.json()) as AuthResponse
}

export const postRegister = async (authPayload: AuthPayload) => {
    const r = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authPayload),
    })
    if (!r.ok) return r.json().then(err => { throw new Error(err.message) })

    return (await r.json()) as AuthResponse
}

export const postLogout = async () => {
    const r = await fetch('/auth/logout', {
        method: 'POST',
    })

    if (!r.ok) return r.json().then(err => { throw new Error(err.message) })
}
