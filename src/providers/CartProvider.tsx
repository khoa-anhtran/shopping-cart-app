import { AuthPayload } from "@/pages/auth/reducers";
import { getUserInfo, postLogin, postLogout, postRefreshToken } from "@/services/authService";
import { useState, ReactNode, useCallback, useMemo, useRef, useEffect } from "react";
import { config } from "@/msal/config";
import { useDispatch, useSelector } from "react-redux";
import { tokenAdded } from "@/pages/auth/actions";
import { getApiToken, initAccount, msalClient } from "@/msal";
import CartContext from "@/contexts/CartContext";
import { Modal } from "antd";
import { cartToggled, checkedOut, fetchCartRequested, itemSelectedToggled, itemsRemoved, quantityDecreased, quantityIncreased, selectAllToggled } from "@/pages/cart/actions";
import useUserInfo from "@/hooks/useUserInfo";
import { useCart } from "@/hooks/useCart";
import { selectCart, selectCartStatus } from "@/pages/cart/selectors";
import { selectProducts } from "@/pages/products/selectors";
import { STATUS } from "@/constants/api";

const CartProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch()

    const { userId } = useUserInfo()

    if (!userId)
        throw new Error("User id is not existed")

    const status = useSelector(selectCartStatus)
    const cartItems = useSelector(selectCart)
    const products = useSelector(selectProducts)

    const isFetchingCart = useRef(false)

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

    useEffect(() => {
        if (status === STATUS.IDLE && !isFetchingCart.current) {
            isFetchingCart.current = true
            dispatch(fetchCartRequested(userId))
        }

    }, [status, userId, dispatch])

    const onIncrease = useCallback((itemId: string) => {
        dispatch(quantityIncreased(itemId, userId))
    }, [dispatch, userId]) //

    const onDecrease = useCallback(async (itemId: string, currentQty: number) => {
        if (currentQty === 1) {
            Modal.confirm({
                title: "Confirm Remove Item",
                content: 'This cannot be undone.',
                onOk: () => {
                    dispatch(quantityDecreased(itemId, userId))
                }
            })
        } else
            dispatch(quantityDecreased(itemId, userId))

    }, [dispatch, userId])

    const onSelectItem = useCallback((itemId: string) => {
        dispatch(itemSelectedToggled(itemId))
    }, [dispatch])

    const onSelectAllItems = useCallback(() => {
        dispatch(selectAllToggled())
    }, [dispatch])

    const onClickCloseCart = useCallback(() => {
        dispatch(cartToggled())
    }, [dispatch])

    const onCheckout = useCallback(async () => {
        Modal.confirm({
            title: "Confirm Checkout", content: 'This cannot be undone.', onOk: () => dispatch(checkedOut(selectedItems, userId))
        })
    }, [dispatch, selectedItems, userId])

    const onRemoveCartItems = useCallback(async (itemIds: string[]) => {
        Modal.confirm({
            title: "Confirm Remove Item",
            content: 'This cannot be undone.',
            onOk: () => dispatch(itemsRemoved(itemIds, userId))
        })
    }, [dispatch, userId])

    const onRefresh = useCallback(() => {
        dispatch(fetchCartRequested(userId))
    }, [dispatch, userId])

    return (
        <CartContext value={{ selectedItems, totalQty, totalValues, onCheckout, onClickCloseCart, onDecrease, onIncrease, onRefresh, onRemoveCartItems, onSelectAllItems, onSelectItem }}>
            {children}
        </CartContext>
    );
};

export default CartProvider