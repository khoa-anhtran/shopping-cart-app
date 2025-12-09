import type { CartItem } from "@/types";
import { formatVnd } from "@/utils";
import { Image } from "antd";
import React from "react";

type CartItemProps = {
    item: CartItem;
    onDecrease: (id: string, qty: number) => void;
    onIncrease: (id: string) => void;
    onSelectItem: (id: string) => void;
    onRemoveCartItem: (id: string) => void;
}

const CartItem = ({ item, onDecrease, onIncrease, onRemoveCartItem, onSelectItem }: CartItemProps) => {
    return <article className="flex items-center w-full gap-4 bg-white dark:bg-gray-700 px-4 rounded-md shadow py-2" role="article" aria-label={item.title}>
        <div>
            <input
                className="h-6 w-6 cursor-pointer hover:opacity-50"
                type="checkbox" role="checkbox" aria-label="toggle select item" checked={item.isSelected} onChange={() => onSelectItem(item.id)} />
        </div>

        <Image src={item?.thumbnail} alt={item.title} className="md:w-24! md:h-24! w-18! h-18!"></Image>

        <div className="flex flex-1 md:items-center gap-4 flex-col md:flex-row">
            <div className="flex-1 space-y-2">
                <h3 className="font-semibold">{item.title}</h3>
                <div className="font-extrabold">
                    {formatVnd(item?.price * item.quantity)}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="row-center gap-4 bg-gray-200 dark:bg-gray-600 h-fit" aria-label="Quantity">
                    <button
                        className="border-r-2 px-2 hover:bg-gray-300 cursor-pointer dark:hover:bg-gray-800"
                        type="button"
                        aria-label="Decrease quantity"
                        data-testid="qty-dec"
                        onClick={() => onDecrease(item.id, item.quantity)}
                    >−</button>

                    <div className="font-extrabold min-w-6 text-center" aria-live="polite" data-testid="qty-value">{item.quantity}</div>

                    <button
                        className="border-l-2 px-2 hover:bg-gray-300 cursor-pointer dark:hover:bg-gray-800"
                        type="button"
                        aria-label="Increase quantity"
                        data-testid="qty-inc"
                        onClick={() => onIncrease(item.id)}
                    >+</button>
                </div>
            </div>
        </div>

        <button
            className="w-9 h-9 cursor-pointer hover:bg-gray-200 rounded-md"
            type="button"
            aria-label="Remove Item"
            onClick={() => onRemoveCartItem(item.id)}
        >✕</button>
    </article>
}

export default React.memo(CartItem)