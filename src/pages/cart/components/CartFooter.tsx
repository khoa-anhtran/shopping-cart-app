import useCart from "@/hooks/useCart"
import { formatVnd, roundTo } from "@/utils/helpers"

type CartFooterProps = {
    hasSelectedItem: boolean
}

const CartFooter = ({ hasSelectedItem }: CartFooterProps) => {
    const { totalValues, onCheckout } = useCart()

    return <footer
        className="flex items-center justify-between px-4 shadow-2xl fixed bottom-0 w-full border-t h-[5%]"
    >
        <div>
            <span className="opacity-90 mr-1.5 font-semibold">Total:</span>
            <span
                className="font-extrabold"
                role="status"
                aria-live="polite"
                aria-label="total values">
                {formatVnd(totalValues)}
            </span>
        </div>
        <button
            className="bg-gray-300 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-200
                disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={onCheckout}
            disabled={!hasSelectedItem}>Checkout</button>
    </footer>
}

export default CartFooter