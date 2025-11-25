import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { selectPDsModalOpen } from "@/pages/layout/ui/uiSelectors"
import { hidePDsModal } from "@/pages/layout/ui/uiActions"
import { Suspense, useCallback, useEffect, useRef } from "react"
import CartSkeleton from "@/pages/cart/components/CartSkeleton"
import ProductDetailsModalContainer from "./ProductDetailsModalContainer"

const ProductDetailsModal = () => {
    const open = useSelector(selectPDsModalOpen)

    const dispatch = useDispatch()

    const previouslyFocused = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const onClickCloseModal = useCallback(() => {
        dispatch(hidePDsModal())
    }, [dispatch])

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

        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClickCloseModal() }
        window.addEventListener('keydown', onKey)

        return () => {
            window.clearTimeout(id);
            window.removeEventListener('keydown', onKey)
            document.documentElement.style.overflow = prevOverflow;
            previouslyFocused.current?.focus();
        };
    }, [open, onClickCloseModal]);

    if (!open)
        return <></>

    return <div
        className={`fixed inset-0 z-40 bg-black/50 flex items-center justify-center`}
        ref={modalRef}
        onClick={onClickCloseModal}
    >
        {open && <Suspense fallback={<CartSkeleton />}>
            <ProductDetailsModalContainer />
        </Suspense>}
    </div>

}

export default ProductDetailsModal