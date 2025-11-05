import { Product } from "@/pages/products/reducers"
import api from "./api"

export const fetchProducts = async () => {
    const res = await api.get('/api/products')

    const data = res.data

    return Object.fromEntries(data.map(({ id, price, thumbnail, title }: Product) => [id, { id, price, thumbnail, title }]))
}