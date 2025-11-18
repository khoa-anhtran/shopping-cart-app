import { Product } from "@/types/product"
import api from "./api"

export const fetchProducts = async () => {
    const res = await api.get('/api/products')
    const data = res.data.products
    return Object.fromEntries(data.map(({ id, price, thumbnail, title, category }: Product) => [id, { id, price, thumbnail, title, category }]))
}