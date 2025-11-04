import { useSelector } from "react-redux"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { selectProducts } from "../products/selectors"
import { useDispatch } from "react-redux"
import { selectCart, selectCartError, selectCartIsSelectAll, selectCartOpen, selectCartStatus } from "./selectors"
import { cartToggled, checkedOut, fetchCartRequested, itemsRemoved, itemSelectedToggled, quantityDecreased, quantityIncreased, selectAllToggled } from "./actions"
import CartItem from "./components/CartItem"
import { roundTo } from "@/utils/math.utils"
import { Modal, notification } from "antd"
import { selectAuth } from "../auth/selectors"


const Cart = () => {
    const dispatch = useDispatch()

    const open = useSelector(selectCartOpen)
    const error = useSelector(selectCartError)
    const status = useSelector(selectCartStatus)
    const cartItems = useSelector(selectCart)
    const isSelectAll = useSelector(selectCartIsSelectAll)
    const { userId } = useSelector(selectAuth)

    // const { data: products, isFetching, error, isError } = useGetProductsQuery()

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

    useEffect(() => {
        if (status === "idle" && !isFetchingCart.current) {
            isFetchingCart.current = true
            dispatch(fetchCartRequested(userId!))
        }
    }, [status, dispatch, userId])

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

        return () => {
            window.clearTimeout(id);
            document.documentElement.style.overflow = prevOverflow;
            previouslyFocused.current?.focus();
        };
    }, [open]);

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
        // const isConfirmed = await askConfirm(dispatch as AppDispatch, {
        //     title: 'Confirm Checkout',
        //     description: 'This cannot be undone.',
        //     confirmText: 'Confirm',
        //     cancelText: 'Cancel',
        // })

        // if (isConfirmed) {
        //     dispatch(cartCheckouted())

        //     dispatch(showSuccess('Done', 'Checkout successfully'))

        // }
    }, [dispatch])

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

    let content

    if (status === "loading") {
        content = <div>Loading ...</div>
    }

    if (status === "failed") {
        content = <div>{error}</div>
    }

    if (status === "succeeded" && Object.keys(products).length != 0) {
        if (cartItems.length === 0)
            content = <p className="empty">Cart is empty</p>
        else
            content = <div className="cart-items">{cartItems.map(item => {
                const product = products[item.id]

                if (!product)
                    return null

                return <CartItem
                    key={product.id}
                    product={product}
                    onRemoveCartItem={(id) => onRemoveCartItems([id])}
                    onDecrease={onDecrease}
                    onIncrease={onIncrease}
                    onSelectItem={onSelectItem}
                    quantity={item.quantity}
                    isSelected={item.isSelected}
                />
            })}</div>
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
            <header className="cart-modal__header">
                <button className="cart-close" aria-label="Close" onClick={onClickCloseCart}>✕</button>
                <div id="cart-title" className="cart-title">
                    Cart (<span role="status" aria-live="polite" aria-label="total items">{totalQty}</span>)
                </div>
            </header>

            <div className="cart-modal__body">
                <div className="cart-actions">
                    <div className="cart-actions__inp">
                        <input
                            type="checkbox"
                            name=""
                            id="selectAllItems"
                            role="checkbox"
                            aria-label="select all items"
                            disabled={cartItems.length === 0}
                            checked={isSelectAll}
                            onChange={onSelectAllItems} />
                        <label htmlFor="selectAllItems">Select All</label>
                    </div>
                    <div>
                        <button
                            className={`remove-all-btn ${selectedItems.length === 0 ? "is-disabled" : ""}`}
                            role="button" aria-label="remove all button"
                            disabled={selectedItems.length === 0}
                            onClick={() => onRemoveCartItems(selectedItems)}
                        >Remove All</button>
                    </div>
                </div>
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