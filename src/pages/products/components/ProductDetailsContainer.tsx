import { ImageWithPreview } from "@/components/ImageWithPreview"
import CommentInput from "@/pages/comments/components/CommentInput"
import CommentRow from "@/pages/comments/components/CommentRow"
import { selectComments, selectCommentIds } from "@/pages/comments/selectors"
import { selectProductIdOpen } from "@/pages/layout/ui/uiSelectors"
import { useRef, useMemo, useCallback, useState, useOptimistic, useEffect } from "react"
import { useSelector } from "react-redux"
import { useMediaQuery } from "react-responsive"
import { selectProducts } from "../selectors"
import ProductDetailsFooter from "./ProductDetailsFooter"
import { Comment } from "@/types/comment"

const ProductDetailsContainer = () => {
    const products = useSelector(selectProducts)
    const id = useSelector(selectProductIdOpen) ?? ""
    const comments = useSelector(selectComments)
    const commentIds = useSelector(selectCommentIds)

    const [canScrollToBottom, setScrolToBottom] = useState(false)

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

    const commentListRef = useRef<HTMLDivElement>(null)

    const product = useMemo(() => products[id], [products, id])

    const onScrollToBottom = useCallback(() => {
        commentListRef.current?.scrollTo({ top: commentListRef.current.scrollHeight, behavior: "smooth" })
    }, [])

    return <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-4 w-screen h-[90vh] md:w-[90vw] md:h-[70vh] 
            lg:w-[60vw] lg:h-[90vh] flex flex-col"
        onClick={(e) => {
            e.stopPropagation()
        }}>

        <div className="px-4 py-3 text-gray-700 dark:text-gray-200 flex h-[95%] flex-col md:flex-row overflow-y-scroll md:overflow-hidden">
            <ImageWithPreview src={product.thumbnail} className="md:w-[40%] w-full h-96" isMobile={isMobile} />

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
                            className="rounded-full bg-gray-200 p-1 cursor-pointer hover:opacity-70"
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
        <ProductDetailsFooter price={product.price} productId={id}></ProductDetailsFooter>


    </div>
}

export default ProductDetailsContainer