export type Product = {
    id: string,
    title: string,
    price: number,
    category: string,
    thumbnail: string
}

export type ProductState = {
    products: Record<string, Product>,
    filteredProducts: Record<string, Product>,
    // filter: {
    //     category: string
    // },
    status: string,
    error: string | null
}

export type ProductPayloadAction = PayloadAction<{ products: Record<number, Product> } | { message: string }>