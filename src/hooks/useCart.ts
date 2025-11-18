import { STATUS } from "@/constants/api"
import { fetchCartRequested } from "@/pages/cart/actions"
import { selectCartStatus, selectCart, selectCartIsSelectAll, selectCartOpen } from "@/pages/cart/selectors"
import { selectProducts } from "@/pages/products/selectors"
import { useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import useUserInfo from "./useUserInfo"

export function useCart() {
    const dispatch = useDispatch()
    const { userId } = useUserInfo()

    const status = useSelector(selectCartStatus)
    const cartItems = useSelector(selectCart)
    const isSelectAll = useSelector(selectCartIsSelectAll)
    const open = useSelector(selectCartOpen)
    const products = useSelector(selectProducts)

    const isFetchingCart = useRef(false)

    const isLoading = status !== STATUS.SUCCESS

    const totalValues = useMemo(() => {
        if (products) {
            return cartItems.reduce((sum, item) => {
                if (item.isSelected) {
                    const product = products[item.itemId]
                    return sum + item.quantity * product.price
                }
                return sum
            }, 0)
        }

        return 0;
    }, [products, cartItems])

    const totalQty = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            return sum + item.quantity
        }, 0)
    }, [cartItems])

    const selectedItems = useMemo(() => {
        return cartItems.filter(item => item.isSelected).map(item => item.itemId)
    }, [cartItems])

    if (!userId)
        throw new Error("User id is not existed")

    useEffect(() => {
        if (status === STATUS.IDLE && !isFetchingCart.current) {
            isFetchingCart.current = true
            dispatch(fetchCartRequested(userId))
        }

    }, [status, userId, dispatch])

    // return { isLoading, cartItems, isSelectAll, open, totalQty, totalValues, selectedItems }
}