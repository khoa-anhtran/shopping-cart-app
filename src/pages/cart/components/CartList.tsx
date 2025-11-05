import { Product } from "@/pages/products/reducers"
import { CartItem as CartItemType } from "../reducers"
import CartItem from "./CartItem";
import { notification } from "antd";

type CartListProps = {
    cartItems: CartItemType[];
    products: Record<number, Product>;
    onRemoveCartItems: (ids: number[]) => void;
    onDecrease: (id: number, currentQty: number) => void;
    onIncrease: (id: number) => void;
    onSelectItem: (id: number) => void;
}

export default function CartList({ cartItems, onDecrease, onIncrease, onRemoveCartItems, onSelectItem, products }: CartListProps) {
    return <div className="cart-items">{cartItems.map(item => {
        const product = products[item.id]

        if (!product) {
            notification.error({ message: "Some products no longer exist" })
            return null
        }

        return <CartItem
            key={product.id}
            product={product}
            onRemoveCartItem={(id) => onRemoveCartItems([id])}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            onSelectItem={onSelectItem}
            quantity={item.quantity}
            isSelected={item.isSelected}
        />
    })}</div>
}