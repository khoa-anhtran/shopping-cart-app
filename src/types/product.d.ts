import { PageInfo } from "."

export type Product = {
    id: string,
    title: string,
    price: number,
    category: string,
    thumbnail: string
}

export type ProductCategory = {
    id: string,
    name: string,
    subCategories?: {
        id: string,
        name: string
    }[]
}

export type ProductState = {
    entities: Record<string, Product>,
    ids: string[],
    categories: ProductCategory[],
    currentCategoryId?: string,
    pageInfo?: PageInfo,
    status: string,
    categoriesStatus: string,
    error: string | null
}

export type ProductPayloadAction = PayloadAction<{ products: Record<number, Product> } | { message: string }>