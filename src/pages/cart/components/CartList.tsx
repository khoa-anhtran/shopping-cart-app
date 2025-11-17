import { Product } from "@/pages/products/reducers"
import { CartItem as CartItemType } from "../reducers"
import CartItem from "./CartItem";
import { notification } from "antd";
import { useEffect } from "react";
import React from "react";

type CartListProps = {
    cartItems: CartItemType[];
    products: Record<number, Product>;
    onRemoveCartItems: (ids: number[]) => void;
    onDecrease: (id: number, currentQty: number) => void;
    onIncrease: (id: number) => void;
    onSelectItem: (id: number) => void;
}

const CartList = ({ cartItems, onDecrease, onIncrease, onRemoveCartItems, onSelectItem, products }: CartListProps) => {
    const missing = cartItems.filter(i => !products[i.id]).map(i => i.id);

    useEffect(() => {
        if (missing.length) notification.error({ message: "Some products no longer exist" });
    }, [missing.length]);

    return <div className="space-y-4"> {cartItems.filter(i => products[i.id]).map(item => {
        const product = products[item.id]!;
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
    })}</div>
}

export default React.memo(CartList)