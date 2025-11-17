import { useSelector } from "react-redux"
import { useCallback, useEffect, useRef } from "react"
import { selectProducts } from "../products/selectors"
import { useDispatch } from "react-redux"
import { cartToggled, checkedOut, fetchCartRequested, itemsRemoved, itemSelectedToggled, quantityDecreased, quantityIncreased, selectAllToggled } from "./actions"
import { roundTo } from "@/utils/helpers"
import { Modal } from "antd"
import CartHeader from "./components/CartHeader"
import CartActions from "./components/CartActions"
import CartList from "./components/CartList"
import { useCart } from "@/hooks/useCart"
import useUserInfo from "@/hooks/useUserInfo"


const Cart = () => {
    const dispatch = useDispatch()

    const { cartItems, isLoading, isSelectAll, open, selectedItems, totalQty, totalValues } = useCart()
    const products = useSelector(selectProducts)
    const { userId } = useUserInfo()

    const previouslyFocused = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    if (!userId)
        throw new Error("User id is not existed")

    const onIncrease = useCallback((itemId: number) => {
        dispatch(quantityIncreased(itemId, userId))
    }, [dispatch, userId])

    const onDecrease = useCallback(async (itemId: number, currentQty: number) => {
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
            title: "Confirm Checkout", content: 'This cannot be undone.', onOk: () => dispatch(checkedOut(selectedItems, userId))
        })
    }, [dispatch, selectedItems, userId])

    const onRemoveCartItems = useCallback(async (itemIds: number[]) => {
        Modal.confirm({
            title: "Confirm Remove Item",
            content: 'This cannot be undone.',
            onOk: () => dispatch(itemsRemoved(itemIds, userId))
        })
    }, [dispatch, userId])

    const onRefresh = useCallback(() => {
        dispatch(fetchCartRequested(userId))
    }, [dispatch, userId])

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

    if (!isLoading && Object.keys(products).length !== 0) {

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
        <aside
            className="cart-modal__panel border-l rounded-tl-xl rounded-bl-xl absolute top-0 right-0 h-full flex flex-col w-full md:w-[70%] lg:w-[50%]"
            onClick={(e) => {
                e.stopPropagation()
            }}>
            <CartHeader onClickCloseCart={onClickCloseCart} totalQty={totalQty} />

            <div className="overflow-auto p-5 bg-gray-100 h-[90%]">
                <CartActions
                    isCartEmpty={cartItems.length === 0}
                    isSelectAll={isSelectAll}
                    hasSelectedItem={selectedItems.length !== 0}
                    onRemoveCartItems={() => onRemoveCartItems(selectedItems)}
                    onSelectAllItems={onSelectAllItems}
                    onRefresh={onRefresh}
                />
                {content}
            </div>

            <footer
                className="flex items-center justify-between px-4 py-2 shadow-2xl fixed bottom-0 w-full border-t h-[5%]"
            >
                <div>
                    <span className="opacity-90 mr-1.5 font-semibold">Total:</span>
                    <span
                        className="font-extrabold"
                        role="status"
                        aria-live="polite"
                        aria-label="total values">
                        {roundTo(totalValues, 2).toLocaleString()}
                    </span>
                    <span className="font-bold"> $</span>
                </div>
                <button
                    className="bg-gray-300 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200
                disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                    onClick={onCheckout}
                    disabled={selectedItems.length === 0}>Checkout</button>
            </footer>
        </aside>
    </div>
}

export default Cart