import { useSelector } from "react-redux"
import { lazy, Suspense, useCallback, useEffect, useRef } from "react"
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
import { Skeleton } from 'antd';
import useCartContext from "@/hooks/useCartContext"
import { selectCartOpen, selectCartStatus } from "./selectors"
import { STATUS } from "@/constants/api"

const CartContainer = lazy(() => import('./components/CartContainer'))

const Cart = () => {
    const { onClickCloseCart } = useCartContext()
    const status = useSelector(selectCartStatus)
    const open = useSelector(selectCartOpen)

    const { userId } = useUserInfo()

    const previouslyFocused = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    if (!userId)
        throw new Error("User id is not existed")

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

    return <div
        className={`cart-modal ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={onClickCloseCart}
        ref={modalRef}
    >
        {open && <Suspense fallback={<aside
            className="cart-modal__panel border-l rounded-tl-xl rounded-bl-xl absolute top-0 right-0 h-full flex flex-col w-full md:w-[70%] lg:w-[50%]
                dark:bg-gray-800 bg-white dark:text-white">
            <Skeleton />
        </aside>}>
            <CartContainer />
        </Suspense>}
    </div>
}

export default Cart