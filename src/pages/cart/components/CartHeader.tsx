import React from "react";

type CartHeaderProps = {
    onClickCloseCart: () => void,
    totalQty: number
}

const CartHeader = ({ onClickCloseCart, totalQty }: CartHeaderProps) => {
    return <header className="flex items-center py-4 px-2 justify-between border-b h-[5%]">
        <button className="cursor-pointer hover:bg-gray-300 rounded-full h-8 w-8" aria-label="Close" onClick={onClickCloseCart}>✕</button>
        <div className="font-bold">
            Cart (<span role="status" aria-live="polite" aria-label="total items">{totalQty}</span>)
        </div>
        <div></div>
    </header >
}

export default React.memo(CartHeader);
