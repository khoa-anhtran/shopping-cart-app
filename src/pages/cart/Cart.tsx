import { useSelector } from "react-redux"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { selectProducts } from "../products/selectors"
import { useDispatch } from "react-redux"
import { selectCart, selectCartError, selectCartIsSelectAll, selectCartOpen, selectCartStatus, selectCartSyncError, selectCartSyncStatus } from "./selectors"
import { cartToggled, checkedOut, fetchCartRequested, itemsRemoved, itemSelectedToggled, quantityDecreased, quantityIncreased, selectAllToggled } from "./actions"
import { notify, roundTo } from "@/utils/helpers"
import { Modal, notification } from "antd"
import { selectAuth } from "../auth/selectors"
import LoadingSpinner from "@/components/LoadingSpinner"
import CartHeader from "./components/CartHeader"
import CartActions from "./components/CartActions"
import CartList from "./components/CartList"


const Cart = () => {
    const dispatch = useDispatch()

    const open = useSelector(selectCartOpen)
    const error = useSelector(selectCartError)
    const status = useSelector(selectCartStatus)

    const syncError = useSelector(selectCartSyncError)
    const syncStatus = useSelector(selectCartSyncStatus)

    const cartItems = useSelector(selectCart)
    const isSelectAll = useSelector(selectCartIsSelectAll)
    const { userId } = useSelector(selectAuth)

    const products = useSelector(selectProducts)

    const totalValues = useMemo(() => {
        if (products) {
            return cartItems.reduce((sum, item) => {
                if (item.isSelected) {
                    const product = products[item.id]
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
        return cartItems.filter(item => item.isSelected).map(item => item.id)
    }, [cartItems])

    const previouslyFocused = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const isFetchingCart = useRef(false)

    const onIncrease = useCallback((itemId: number) => {
        dispatch(quantityIncreased(itemId))
    }, [dispatch])

    const onDecrease = useCallback(async (itemId: number, currentQty: number) => {
        if (currentQty === 1) {

            Modal.confirm({
                title: "Confirm Remove Item",
                content: 'This cannot be undone.',
                onOk: () => {
                    dispatch(quantityDecreased(itemId))
                    notification.success({ message: "Remove successfully" })
                }
            })
        } else
            dispatch(quantityDecreased(itemId))

    }, [dispatch])

    const onSelectItem = useCallback((itemId: number) => {
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
            title: "Confirm Checkout", content: 'This cannot be undone.', onOk: () => {
                dispatch(checkedOut(selectedItems))

                notification.success({ message: 'Checkout successfully' })
            }
        })
    }, [dispatch, selectedItems])

    const onRemoveCartItems = useCallback(async (itemIds: number[]) => {
        Modal.confirm({
            title: "Confirm Remove Item",
            content: 'This cannot be undone.',
            onOk: () => {
                dispatch(itemsRemoved(itemIds))
                notification.success({ message: "Remove successfully" })
            }
        })
    }, [dispatch])

    const onRefresh = useCallback(() => {
        isFetchingCart.current = true
        dispatch(fetchCartRequested())
    }, [dispatch])

    useEffect(() => {
        notify({ status, error, message: "Fetch cart successfully" })

        if (status === "idle" && !isFetchingCart.current) {
            isFetchingCart.current = true
            dispatch(fetchCartRequested())
        }

    }, [status, userId, dispatch, error])

    useEffect(() => {
        notify({ status: syncStatus, error: syncError, message: "Sync cart successfully" })
    }, [syncStatus, dispatch, syncError])

    // lock scroll & manage focus
    useEffect(() => {
        if (!open) return;

        previouslyFocused.current = document.activeElement as HTMLElement | null;

        const prevOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';

        const id = window.setTimeout(() => {
            const el = modalRef.current;
            if (!el) return;
            const firstFocusable = el.querySelector<HTMLElement>(
                'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
            );
            firstFocusable?.focus();
        }, 0);

        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClickCloseCart() }
        window.addEventListener('keydown', onKey)

        return () => {
            window.clearTimeout(id);
            window.removeEventListener('keydown', onKey)
            document.documentElement.style.overflow = prevOverflow;
            previouslyFocused.current?.focus();
        };
    }, [open, onClickCloseCart]);



    let content

    if (status === "loading")
        content = <div style={{ textAlign: "center", marginTop: "12px" }}><LoadingSpinner label="Loading data" size={"lg"}></LoadingSpinner></div>

    if (status === "failed")
        content = <div>{error}</div>

    if (status === "succeeded" && Object.keys(products).length !== 0) {

        if (cartItems.length === 0)
            content = <p className="empty">Cart is empty</p>
        else
            content = <CartList
                cartItems={cartItems}
                onDecrease={onDecrease}
                onIncrease={onIncrease}
                onRemoveCartItems={onRemoveCartItems}
                onSelectItem={onSelectItem}
                products={products}
            />
    }

    return <div
        className={`cart-modal ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={onClickCloseCart}
        ref={modalRef}>
        <div className="cart-modal__overlay"></div>
        <aside className="cart-modal__panel" onClick={(e) => {
            e.stopPropagation()
        }}>
            <CartHeader onClickCloseCart={onClickCloseCart} totalQty={totalQty} />

            <div className="cart-modal__body">
                <CartActions
                    isDisabled={cartItems.length === 0}
                    isSelectAll={isSelectAll}
                    selectedItems={selectedItems}
                    onRemoveCartItems={onRemoveCartItems}
                    onSelectAllItems={onSelectAllItems}
                    onRefresh={onRefresh}
                />
                {content}
            </div>

            <footer className="cart-modal__footer">
                <div className="total">
                    <span className="label">Total:</span>
                    <span
                        className="amount"
                        role="status"
                        aria-live="polite"
                        aria-label="total values">
                        {roundTo(totalValues, 2).toLocaleString()}
                    </span>
                    <span className="currency"> $</span>
                </div>
                <button className={`checkout-btn ${selectedItems.length === 0 ? "is-disabled" : ""} `} onClick={onCheckout} disabled={selectedItems.length === 0}>Checkout</button>
            </footer>
        </aside>
    </div>
}

export default Cart