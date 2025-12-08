export type CartItem = {
    quantity: number,
    addedAt: string,
    category: string,
    id: string,
    price: number,
    title: string,
    thumbnail: string
    isSelected: boolean,
}

export type CartState = {
    entities: Record<string, CartItem>,
    ids: string[],
    status: string,
    syncStatus: string,
    error: string | null,
    syncError: string | null,
    isSelectAll: boolean;
    isOpen: boolean;
}

export type CartPayloadAction = PayloadAction<
    { message: string } |
    { items: Omit<CartItem, 'isSelected'>[] } |
    { itemIds: string[] } |
    { itemId: string }
>