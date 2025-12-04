import { PageInfo } from "."

export type Product = {
    id: string,
    title: string,
    price: number,
    category: string,
    thumbnail: string
}

export type ProductState = {
    entities: Record<string, Product>,
    ids: string[],
    filteredProducts: Record<string, Product>,
    // filter: {
    //     category: string
    // },
    pageInfo?: PageInfo,
    status: string,
    error: string | null
}

export type ProductPayloadAction = PayloadAction<{ products: Record<number, Product> } | { message: string }>