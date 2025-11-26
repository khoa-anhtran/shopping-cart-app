import useUserInfo from "@/hooks/useUserInfo"
import { itemAdded } from "@/pages/cart/actions"
import { useCallback } from "react"
import { useDispatch } from "react-redux"

type ProductDetailsFooterProps = {
    price: number,
    productId: string
}

const ProductDetailsFooter = ({ price, productId }: ProductDetailsFooterProps) => {
    const dispatch = useDispatch()
    const { userId } = useUserInfo()

    const onAddToCart = useCallback(() => {
        dispatch(itemAdded(productId, userId!))
    }, [dispatch, userId, productId])

    return <div className="flex justify-end items-center gap-4 border-t border-gray-200 dark:border-gray-700 px-4 py-3 h-[5%] dark:text-white">
        <div className="px-4 py-2 space-y-4">
            <div className="md:text-xl font-bold">
                {price}<span> $</span>
            </div>
        </div>

        <button
            type="button"
            className="px-2 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-500 active:bg-green-700  cursor-pointer"
            onClick={onAddToCart}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" >
                <path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95A1 1 0 0 0 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33zM11 11h2V9h2v2h2v2h-2v2h-2v-2h-2z"></path>
            </svg>
        </button>
    </div>
}

export default ProductDetailsFooter