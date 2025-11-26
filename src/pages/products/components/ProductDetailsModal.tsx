import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { selectPDsModalOpen } from "@/pages/layout/ui/uiSelectors"
import { hidePDsModal } from "@/pages/layout/ui/uiActions"
import { lazy, Suspense, useCallback, useEffect, useRef } from "react"
import CartSkeleton from "@/pages/cart/components/CartSkeleton"
import { useLockModal } from "@/hooks/useLockModal"

const ProductDetailsModalContainer = lazy(() => import("./ProductDetailsModalContainer"))

const ProductDetailsModal = () => {
    const open = useSelector(selectPDsModalOpen)

    const dispatch = useDispatch()

    const modalRef = useRef<HTMLDivElement>(null);

    const onClickCloseModal = useCallback(() => {
        dispatch(hidePDsModal())
    }, [dispatch])

    // lock scroll & manage focus
    useLockModal(open, modalRef, onClickCloseModal)

    return <div
        className={`fixed inset-0 z-40 bg-black/50 flex items-center justify-center ${!open && "hidden"}`}
        ref={modalRef}
        onClick={onClickCloseModal}
    >
        {open && <Suspense fallback={<CartSkeleton />}>
            <ProductDetailsModalContainer />
        </Suspense>}
    </div>

}

export default ProductDetailsModal