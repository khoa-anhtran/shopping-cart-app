import CartItem from "./CartItem";
import { notification } from "antd";
import { useEffect } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { selectCartEntities, selectCartIds } from "../selectors";
import { selectProducts } from "@/pages/products/selectors";
import useCart from "@/hooks/useCart";

const CartList = () => {
    const cartItemIds = useSelector(selectCartIds)
    const cartItemEntities = useSelector(selectCartEntities)
    const products = useSelector(selectProducts)

    const { onIncrease, onDecrease, onRemoveCartItems, onSelectItem } = useCart()

    const missing = cartItemIds.filter(id => !products[id]).map(id => id);

    useEffect(() => {
        if (missing.length) notification.error({ message: "Some products no longer exist" });
    }, [missing.length]);

    return <div className="space-y-4">
        {cartItemIds.filter(id => products[id]).map(id => {
            const product = products[id]!;
            const item = cartItemEntities[id]

            return (
                <CartItem
                    key={product.id}
                    product={product}
                    onRemoveCartItem={(id) => onRemoveCartItems([id])}
                    onDecrease={onDecrease}
                    onIncrease={onIncrease}
                    onSelectItem={onSelectItem}
                    quantity={item.quantity}
                    isSelected={item.isSelected}
                />
            );
        })}
    </div>
}

export default React.memo(CartList)