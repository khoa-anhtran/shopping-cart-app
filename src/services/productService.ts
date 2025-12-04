import { Product } from "@/types/product"
import api from "./api"
import { IModelConnection } from "@/types"

export const fetchProducts = async (after?: string): Promise<IModelConnection<Product>> => {
    const res = await api.get(`/api/products${after ? `?after=${after}` : ""}`)
    const data = res.data
    return data
}