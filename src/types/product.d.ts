export type Product = {
    _id: string,
    id: number,
    title: string,
    price: number,
    thumbnail: string
}

export type ProductState = {
    products: Record<string, Product>,
    status: string,
    error: string | null
}

export type ProductPayloadAction = PayloadAction<{ products: Record<number, Product> } | { message: string }>