import CartItem from "./CartItem";
import React from "react";
import { useSelector } from "react-redux";
import { selectCartEntities, selectCartIds } from "../selectors";
import useCart from "@/hooks/useCart";

const CartList = () => {
    const cartItemIds = useSelector(selectCartIds)
    const cartItemEntities = useSelector(selectCartEntities)

    const { onIncrease, onDecrease, onRemoveCartItems, onSelectItem } = useCart()

    return <div className="space-y-4">
        {cartItemIds.map(id => {
            const item = cartItemEntities[id]

            return (
                <CartItem
                    key={item.id}
                    item={item}
                    onRemoveCartItem={(id) => onRemoveCartItems([id])}
                    onDecrease={onDecrease}
                    onIncrease={onIncrease}
                    onSelectItem={onSelectItem}
                />
            );
        })}
    </div>
}

export default React.memo(CartList)