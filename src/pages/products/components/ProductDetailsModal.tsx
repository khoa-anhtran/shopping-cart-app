import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { selectPDsModalOpen } from "@/pages/layout/ui/uiSelectors"
import { hidePDsModal } from "@/pages/layout/ui/uiActions"
import { lazy, Suspense, useCallback, useRef } from "react"
import { useLockModal } from "@/hooks/useLockModal"
import ProductDetailsSkeleton from "./ProductDetailsSkeleton"

const ProductDetailsContainer = lazy(() => import("./ProductDetailsContainer"))

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
        {open && <Suspense fallback={<ProductDetailsSkeleton />}>
            <ProductDetailsContainer />
        </Suspense>}
    </div>

}

export default ProductDetailsModal