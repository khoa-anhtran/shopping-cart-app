import { Product } from "@/types/product"
import api from "./api"
import { IModelConnection } from "@/types"

export const fetchProducts = async (after?: string, categoryId?: string): Promise<IModelConnection<Product>> => {
    const query = []
    if (after)
        query.push(`after=${after}`)

    if (categoryId)
        query.push(`categoryId=${categoryId}`)

    const res = await api.get(`/api/products${query.length !== 0 ? `?${query.join("&")}` : ""}`, {
        headers: {
            "x-skip-loading": "1"
        }
    })
    const data = res.data
    return data
}

export const fetchCategories = async () => {
    const res = await api.get("/api/products/categories")

    return res.data
}