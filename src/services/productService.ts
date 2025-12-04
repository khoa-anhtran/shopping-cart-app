import { Product } from "@/types/product"
import api from "./api"
import { IModelConnection } from "@/types"

export const fetchProducts = async (): Promise<IModelConnection<Product>> => {
    const res = await api.get('/api/products')
    const data = res.data
    return data
}