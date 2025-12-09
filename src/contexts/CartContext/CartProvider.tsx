import { ReactNode, useCallback, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import {
    cartToggled, fetchCartRequested, itemSelectedToggled, itemsRemoved, quantityDecreased,
    quantityIncreased, selectAllToggled, selectCartEntities, selectCartStatus
} from "@/pages/cart";
import { useUserInfo } from "@/contexts/UserInfoContext";
import { STATUS } from "@/constants";
import { useNavigate } from "react-router-dom";
import { checkedOut } from "@/pages/checkout";
import CartContext from "./CartContext";

const CartProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { userId } = useUserInfo()

    if (!userId)
        throw new Error("User id is not existed")

    const status = useSelector(selectCartStatus)
    const cartEntities = useSelector(selectCartEntities)
    const cartItems = useMemo(() => {
        return Object.values(cartEntities)
    }, [cartEntities])

    const isFetchingCart = useRef(false)

    const totalValues = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            if (item.isSelected) {

                return sum + item.quantity * item.price
            }
            return sum
        }, 0)
    }, [cartItems])

    const totalQty = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            return sum + item.quantity
        }, 0)
    }, [cartItems])

    const selectedItems = useMemo(() => {
        return cartItems.filter(item => item.isSelected).map(item => item.id)
    }, [cartItems])

    useEffect(() => {
        if (status === STATUS.IDLE && !isFetchingCart.current) {
            isFetchingCart.current = true
            dispatch(fetchCartRequested())
        }

    }, [status, dispatch])

    const onIncrease = useCallback((itemId: string) => {
        dispatch(quantityIncreased(itemId))
    }, [dispatch])

    const onDecrease = useCallback(async (itemId: string, currentQty: number) => {
        if (currentQty === 1) {
            Modal.confirm({
                title: "Confirm Remove Item",
                content: 'This cannot be undone.',
                onOk: () => {
                    dispatch(quantityDecreased(itemId))
                }
            })
        } else
            dispatch(quantityDecreased(itemId))

    }, [dispatch])

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
            title: "Confirm Checkout",
            content: 'This cannot be undone.',
            onOk: () => {
                navigate("/checkout")
                dispatch(checkedOut())
            }
        })
    }, [dispatch, navigate])

    const onRemoveCartItems = useCallback(async (itemIds: string[]) => {
        Modal.confirm({
            title: "Confirm Remove Item",
            content: 'This cannot be undone.',
            onOk: () => dispatch(itemsRemoved(itemIds))
        })
    }, [dispatch])

    const onRefresh = useCallback(() => {
        dispatch(fetchCartRequested())
    }, [dispatch])

    return (
        <CartContext value={{ cartItems, selectedItems, totalQty, totalValues, onCheckout, onClickCloseCart, onDecrease, onIncrease, onRefresh, onRemoveCartItems, onSelectAllItems, onSelectItem }}>
            {children}
        </CartContext>
    );
};

export default CartProvider