import { Product } from "@/pages/products/reducers";
import React from "react";

type CartItemProps = {
    product: Product;
    quantity: number;
    onDecrease: (id: number, qty: number) => void;
    onIncrease: (id: number) => void;
    onSelectItem: (id: number) => void;
    onRemoveCartItem: (id: number) => void;
    isSelected: boolean
}

const CartItem = ({ product, onDecrease, onIncrease, onRemoveCartItem, quantity, onSelectItem, isSelected }: CartItemProps) => {
    return <article className="flex items-center w-full gap-4 bg-white px-4 rounded-md shadow py-2" role="article" aria-label={product.title}>
        <div>
            <input
                className="h-6 w-6 cursor-pointer hover:opacity-50"
                type="checkbox" role="checkbox" aria-label="toggle select item" checked={isSelected} onChange={() => onSelectItem(product.id)} />
        </div>

        <div className="md:w-24 md:h-24 w-18 h-18">
            <img
                src={product?.thumbnail} alt={product.title}
                className="max-w-[90%] max-h-[90%} object-contain"
            />
        </div>

        <div className="flex flex-1 md:items-center gap-4 flex-col md:flex-row">
            <div className="flex-1 space-y-2">
                <h3 className="font-semibold">{product.title}</h3>
                <div className="font-extrabold">
                    {product?.price}<span> $</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="row-center gap-4 bg-gray-200 h-fit" aria-label="Quantity">
                    <button
                        className="border-r-2 px-2 hover:bg-gray-300 cursor-pointer"
                        type="button"
                        aria-label="Decrease quantity"
                        data-testid="qty-dec"
                        onClick={() => onDecrease(product.id, quantity)}
                    >−</button>

                    <div className="font-extrabold min-w-6 text-center" aria-live="polite" data-testid="qty-value">{quantity}</div>

                    <button
                        className="border-l-2 px-2 hover:bg-gray-300 cursor-pointer"
                        type="button"
                        aria-label="Increase quantity"
                        data-testid="qty-inc"
                        onClick={() => onIncrease(product.id)}
                    >+</button>
                </div>
            </div>
        </div>

        <button
            className="w-9 h-9 cursor-pointer hover:bg-gray-200 rounded-md"
            type="button"
            aria-label="Remove Item"
            onClick={() => onRemoveCartItem(product.id)}
        >✕</button>
    </article>
}

export default React.memo(CartItem)