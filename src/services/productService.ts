import { Product } from "@/types/product"
import api from "./api"
import { IModelConnection } from "@/types"

export const fetchProducts = async (after?: string): Promise<IModelConnection<Product>> => {
    const res = await api.get(`/api/products${after ? `?after=${after}` : ""}`, {
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