import { AuthPayload } from "@/pages/auth/reducers";
import { createContext } from "react";

export type CartCtx = {
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

const CartContext = createContext<CartCtx>({
    selectedItems: [],
    totalQty: 0,
    totalValues: 0,
    onIncrease: () => { },
    onDecrease: async () => { },
    onSelectItem: () => { },
    onSelectAllItems: () => { },
    onClickCloseCart: () => { },
    onCheckout: async () => { },
    onRemoveCartItems: async () => { },
    onRefresh: () => { }
});

export default CartContext
