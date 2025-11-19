import { ImageWithPreview } from "@/components/ImageWithPreview"
import { Skeleton } from "antd"
import { useSelector } from "react-redux"
import { selectProducts } from "../selectors"
import { useDispatch } from "react-redux"
import { selectPDsModalOpen, selectProductIdOpen } from "@/pages/layout/ui/uiSelectors"
import { hidePDsModal } from "@/pages/layout/ui/uiActions"
import { useCallback, useEffect, useRef } from "react"
import { selectCommentIds, selectComments } from "@/pages/comments/selectors"
import CommentRow from "@/pages/comments/components/CommentRow"

const ProductDetailsModal = () => {
    const products = useSelector(selectProducts)
    const open = useSelector(selectPDsModalOpen)
    const id = useSelector(selectProductIdOpen) ?? ""
    const comments = useSelector(selectComments)
    const commentIds = useSelector(selectCommentIds)


    const dispatch = useDispatch()

    const previouslyFocused = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const product = products[id]

    const onClickCloseModal = useCallback(() => {
        dispatch(hidePDsModal())
    }, [])

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

    if (open)
        return <div
            className={`fixed inset-0 z-40 bg-black/50 flex items-center justify-center`}
            ref={modalRef}
            onClick={onClickCloseModal}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-4 lg:w-[60vw] lg:h-[70vh] flex flex-col"
                onClick={(e) => {
                    e.stopPropagation()
                }}>

                <div className="px-4 py-3 text-gray-700 dark:text-gray-200 flex h-[90%]">
                    <ImageWithPreview src={product.thumbnail} className="w-[40%]" />

                    <div className="w-[60%] border-l border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col gap-4">

                        <div className="font-extrabold text-xl">{product.title}</div>
                        <div className="font-bold">Comments</div>

                        <div className="flex flex-col overflow-y-scroll gap-4 px-4 py-2 min-h-[80%]">
                            {commentIds.map(commentId => {
                                const comment = comments[commentId]

                                return <CommentRow key={commentId} comment={comment} />
                            })}

                            <Skeleton active avatar />

                            {/* <Skeleton active avatar />
                            <Skeleton active avatar />
                            <Skeleton active avatar />
                            <Skeleton active avatar />
                            <Skeleton active avatar />
                            <Skeleton active avatar /> */}
                        </div>

                    </div>
                </div>

                <div className="flex justify-end items-center gap-4 border-t border-gray-200 dark:border-gray-700 px-4 py-3 h-[10%]">
                    <div className="px-4 py-2 space-y-4">
                        <div className="md:text-xl font-bold">
                            {product.price}<span> $</span>
                        </div>
                    </div>

                    {/* <div className="row-center gap-4 bg-blue-600 text-white rounded-md">
                    <button className="text-2xl cursor-pointer hover:bg-blue-400 active:bg-blue-700 px-2 rounded-tl-md rounded-bl-md h-full border-r border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" viewBox="0 0 24 24" >
                            <path d="M3 11h18v2H3z"></path>
                        </svg>
                    </button>
                    <div>10</div>
                    <button className="text-2xl cursor-pointer hover:bg-blue-400 active:bg-blue-700 px-2 rounded-tr-md rounded-br-md h-full border-l border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" viewBox="0 0 24 24" >
                            <path d="M11 17v4h2v-8h8v-2h-8V3h-2v8H3v2h8v4"></path>
                        </svg>
                    </button>
                </div> */}

                    <button
                        type="button"
                        className="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-500 active:bg-green-700  cursor-pointer"

                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" >
                            <path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95A1 1 0 0 0 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33zM11 11h2V9h2v2h2v2h-2v2h-2v-2h-2z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

}

export default ProductDetailsModal