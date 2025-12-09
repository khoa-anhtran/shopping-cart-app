import { CartItem } from "@/types";
import { createContext } from "react";

export type CartCtx = {
    cartItems: CartItem[],
    totalValues: number,
    totalQty: number,
    selectedItems: string[],
    onIncrease: (itemId: string) => void,
    onDecrease: (itemId: string, currentQty: number) => Promise<void>,
    onSelectItem: (itemId: string) => void,
    onSelectAllItems: () => void,
    onClickCloseCart: () => void,
    onCheckout: () => Promise<void>,
    onRemoveCartItems: (itemIds: string[]) => Promise<void>,
    onRefresh: () => void
}

const CartContext = createContext<CartCtx | undefined>(undefined);

export default CartContext
