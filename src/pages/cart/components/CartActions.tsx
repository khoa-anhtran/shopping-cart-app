import { useCart } from "@/contexts/CartContext";
import React from "react";
import { useSelector } from "react-redux";
import { selectCartIsSelectAll, selectCartSyncStatus } from "../selectors";
import { STATUS } from "@/constants";

type CartActionsProps = {
    isCartEmpty: boolean;
    hasSelectedItem: boolean;
    onRemoveCartItems: () => void
}

const CartActions = ({ isCartEmpty, hasSelectedItem, onRemoveCartItems }: CartActionsProps) => {
    const { onSelectAllItems, onRefresh } = useCart()
    const isSelectAll = useSelector(selectCartIsSelectAll)
    const status = useSelector(selectCartSyncStatus)

    return <div className="flex items-center gap-8 mb-4">
        <div className="row-center gap-4">
            <input
                type="checkbox"
                id="selectAllItems"
                aria-label="select all items"
                disabled={isCartEmpty}
                checked={isSelectAll}
                onChange={onSelectAllItems}
                className="w-6 h-6 cursor-pointer hover:opacity-50"
            />
            <label htmlFor="selectAllItems" className="font-bold">Select All</label>
        </div>

        <div className="flex flex-1 items-center gap-4">
            <button
                className="cursor-pointer bg-white dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-300 font-bold shadow px-3 py-2 rounded-md 
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-400"
                aria-label="remove all button"
                disabled={!hasSelectedItem}
                onClick={onRemoveCartItems}
            >Remove All</button>

            <button
                className="cursor-pointer bg-white hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold shadow px-3 py-2 rounded-md"
                aria-label="refresh button"
                onClick={onRefresh}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M19.07 4.93a9.9 9.9 0 0 0-3.18-2.14 10.12 10.12 0 0 0-7.79 0c-1.19.5-2.26 1.23-3.18 2.14S3.28 6.92 2.78 8.11A9.95 9.95 0 0 0 1.99 12h2c0-1.08.21-2.13.63-3.11.4-.95.98-1.81 1.72-2.54.73-.74 1.59-1.31 2.54-1.71 1.97-.83 4.26-.83 6.23 0 .95.4 1.81.98 2.54 1.72.17.17.33.34.48.52L16 9.01h6V3l-2.45 2.45c-.15-.18-.31-.36-.48-.52M19.37 15.11c-.4.95-.98 1.81-1.72 2.54-.73.74-1.59 1.31-2.54 1.71-1.97.83-4.26.83-6.23 0-.95-.4-1.81-.98-2.54-1.72-.17-.17-.33-.34-.48-.52l2.13-2.13H2v6l2.45-2.45c.15.18.31.36.48.52.92.92 1.99 1.64 3.18 2.14 1.23.52 2.54.79 3.89.79s2.66-.26 3.89-.79c1.19-.5 2.26-1.23 3.18-2.14s1.64-1.99 2.14-3.18c.52-1.23.79-2.54.79-3.89h-2c0 1.08-.21 2.13-.63 3.11Z"></path>
                </svg>
            </button>

            <div className="flex-1 flex items-center justify-end gap-4">
                <span className="italic">{status === STATUS.FAIL ? "Sync cart failed" : status === STATUS.LOADING ? "Syncing" : ""}</span>

                <button
                    className="cursor-pointer bg-white hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-bold shadow px-3 py-2 rounded-md disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                    aria-label="sync button"
                    onClick={onRefresh}
                    disabled={status !== STATUS.FAIL}
                >
                    SYNC
                </button>
            </div>
        </div>
    </div>
}

export default React.memo(CartActions);