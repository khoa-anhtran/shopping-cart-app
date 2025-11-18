import { Product } from "@/types/product";
import { CartItem as CartItemType } from "@/types/cart"
import CartItem from "./CartItem";
import { notification } from "antd";
import { useEffect } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { selectCart } from "../selectors";
import { selectProducts } from "@/pages/products/selectors";
import useCart from "@/hooks/useCart";

const CartList = () => {
    const cartItems = useSelector(selectCart)
    const products = useSelector(selectProducts)

    console.log(cartItems)

    const { onIncrease, onDecrease, onRemoveCartItems, onSelectItem } = useCart()

    const missing = cartItems.filter(i => !products[i.itemId]).map(i => i.itemId);

    useEffect(() => {
        if (missing.length) notification.error({ message: "Some products no longer exist" });
    }, [missing.length]);

    return <div className="space-y-4">
        {cartItems.filter(i => products[i.itemId]).map(item => {
            const product = products[item.itemId]!;

            return (
                <CartItem
                    key={product._id}
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