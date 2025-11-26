import { ImageWithPreview } from "@/components/ImageWithPreview"
import CommentInput from "@/pages/comments/components/CommentInput"
import CommentRow from "@/pages/comments/components/CommentRow"
import { selectComments, selectCommentIds } from "@/pages/comments/selectors"
import { selectProductIdOpen } from "@/pages/layout/ui/uiSelectors"
import { useRef, useMemo, useCallback, useState, useOptimistic, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useMediaQuery } from "react-responsive"
import { selectProducts } from "../selectors"
import ProductDetailsFooter from "./ProductDetailsFooter"
import { Comment } from "@/types/comment"
import useUserInfo from "@/hooks/useUserInfo"
import { itemAdded } from "@/pages/cart/actions"

const ProductDetailsContainer = () => {
    const dispatch = useDispatch()

    const products = useSelector(selectProducts)
    const id = useSelector(selectProductIdOpen) ?? ""
    const comments = useSelector(selectComments)
    const commentIds = useSelector(selectCommentIds)

    const { userId } = useUserInfo()

    const [canScrollToBottom, setScrolToBottom] = useState(false)

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

    const commentListRef = useRef<HTMLDivElement>(null)

    const product = useMemo(() => products[id], [products, id])

    const onScrollToBottom = useCallback(() => {
        commentListRef.current?.scrollTo({ top: commentListRef.current.scrollHeight, behavior: "smooth" })
    }, [])

    const onAddToCart = useCallback(() => {
        dispatch(itemAdded(id, userId!))
    }, [dispatch, userId, id])

    return <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-4 w-screen h-[90vh] md:w-[90vw] md:h-[70vh] 
            lg:w-[60vw] lg:h-[90vh] flex flex-col"
        onClick={(e) => {
            e.stopPropagation()
        }}>

        <div className="px-4 py-3 text-gray-700 dark:text-gray-200 flex flex-col md:flex-row overflow-y-scroll md:overflow-hidden h-full">
            <div className="md:w-[40%] w-full flex-col flex justify-between">
                <ImageWithPreview src={product.thumbnail} className="h-[70%]" isMobile={isMobile} />
                <div className="flex justify-end items-center gap-4 border-t border-gray-200 dark:border-gray-700 px-4 py-3 dark:text-white">
                    <div className="px-4 py-2 space-y-4">
                        <div className="md:text-xl font-bold">
                            {product.price}<span> $</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="px-2 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-500 active:bg-green-700  cursor-pointer"
                        onClick={onAddToCart}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" >
                            <path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95A1 1 0 0 0 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33zM11 11h2V9h2v2h2v2h-2v2h-2v-2h-2z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="md:w-[60%] border-l border-gray-200 dark:border-gray-700 px-4 flex flex-col gap-4">

                <div className="font-extrabold text-xl">{product.title}</div>
                <div className="font-bold">Comments</div>

                <div className="flex flex-col md:overflow-y-scroll gap-4 md:h-[80%] relative" ref={commentListRef} onScroll={(e) => {
                    const list = e.currentTarget
                    if (list.scrollTop + list.clientHeight >= list.scrollHeight - 40)
                        setScrolToBottom(false)
                    else
                        setScrolToBottom(true)
                }}>
                    {commentIds.map(commentId => {

                        const comment = comments[commentId]

                        if (comment && comment.depth === 0)
                            return <CommentRow key={commentId} comment={comment} depth={0} productId={id} setScrolToBottom={() => setScrolToBottom(true)} />
                    })}

                    {canScrollToBottom && <div className="sticky bottom-2 row-center">
                        <button
                            type="button"
                            className="rounded-full bg-gray-100 border border-gray-200 p-1 cursor-pointer hover:opacity-70"
                            onClick={onScrollToBottom}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" >
                                <path d="m12 15.59-4.29-4.3-1.42 1.42 5.71 5.7 5.71-5.7-1.42-1.42z"></path>
                                <path d="m12 10.59-4.29-4.3-1.42 1.42 5.71 5.7 5.71-5.7-1.42-1.42z"></path>
                            </svg>
                        </button>
                    </div>}


                </div>

                <CommentInput
                    id={id}
                    depth={0}
                    setScrolToBottom={() => setScrolToBottom(true)}
                />
            </div>
        </div>
    </div>
}

export default ProductDetailsContainer