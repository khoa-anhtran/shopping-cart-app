import { ImageWithPreview } from "@/components/ImageWithPreview"
import { formatVnd } from "@/utils/helpers"
import { Button, Progress, Rate } from "antd"
import { useSelector } from "react-redux"
import { selectProducts } from "../products/selectors"
import { useNavigate, useParams } from "react-router-dom"
import { useProducts } from "@/hooks/useProducts"
import { selectCommentIds, selectCommentPageInfo, selectComments } from "../comments/selectors"
import { useCallback, useRef, useState } from "react"
import { useMediaQuery } from "react-responsive"
import CommentRow from "../comments/components/CommentRow"
import ProductCard from "../products/components/ProductCard"
import { useDispatch } from "react-redux"
import { fetchCommentsRequested, fetchMoreCommentsRequested } from "../comments/actions"
import { LikeFilled, LikeOutlined, StarOutlined } from "@ant-design/icons"
import CommentInput from "../comments/components/CommentInput"

const ProductDetails = () => {
    const { productId } = useParams<{ productId: string }>();

    const { products, isLoading } = useProducts({})

    const comments = useSelector(selectComments)
    const commentIds = useSelector(selectCommentIds)
    const commentPageInfo = useSelector(selectCommentPageInfo)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [canScrollToBottom, setScrolToBottom] = useState(false)

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

    const commentListRef = useRef<HTMLDivElement>(null)

    if (!productId)
        throw new Error("No product id is existed")

    if (isLoading)
        return <></>

    const onScrollToBottom = useCallback(() => {
        commentListRef.current?.scrollTo({ top: commentListRef.current.scrollHeight, behavior: "smooth" })
    }, [])

    const onDisplayScrollToBottom = useCallback(() => {
        const list = commentListRef.current

        if (!list)
            return

        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 40)
            setScrolToBottom(false)
        else
            setScrolToBottom(true)
    }, [])

    const onClickProduct = useCallback((productId: string) => {
        navigate(`/products/${productId}`)
        dispatch(fetchCommentsRequested(productId))
    }, [navigate])

    const onFetchMoreComments = useCallback(() => {
        const after = commentPageInfo ? commentPageInfo.endCursor : ""
        dispatch(fetchMoreCommentsRequested(productId, after))

    }, [commentPageInfo, productId])

    const product = products[productId]

    return <main className="py-4 px-8 flex gap-4">
        <section className="w-[70%] space-y-8 px-4 py-8 bg-white rounded-md shadow">
            <div className="row-center">
                <ImageWithPreview
                    className="h-60 w-1/2"
                    src={product.thumbnail}
                />
            </div>

            <div className="w-full px-4">
                <h3 className="font-bold text-xl">
                    Relevant Products
                </h3>

                <div className="flex gap-4 py-2 px-1 overflow-x-scroll">
                    {Object.values(products).map(product =>
                        <ProductCard
                            key={product.id}
                            product={product}
                            className="shrink-0 w-60 shadow-none border border-gray-200"
                            size="sm"
                            onClick={() => onClickProduct(product.id)}
                        />)
                    }
                </div>
            </div>

            <div className="space-y-4 px-4">
                <h3 className="font-bold text-xl">
                    Rating
                </h3>

                <div className="flex gap-4 items-center">
                    <span className="font-bold text-amber-300 text-2xl">4.9</span>
                    <Rate disabled allowHalf defaultValue={4.9} />
                </div>

                <div>
                    {[5, 4, 3, 2, 1].map(star => <div key={`star-${star}`} className="flex items-center gap-2">
                        <span>{star}</span>
                        <StarOutlined />
                        <Progress size={"small"} percent={Math.floor(Math.random() * 100)} strokeColor={"gray"} />
                    </div>)}
                </div>

                <div className="space-y-4">
                    <div className="space-y-2 border border-gray-200 px-3 py-2 rounded-md">
                        <div className="font-bold">Khoa</div>
                        <Rate disabled allowHalf defaultValue={5} />
                        <div>This food is very good</div>
                        <div className="flex items-center gap-2">
                            <LikeOutlined />
                            Useful {true && "(1)"}
                        </div>
                    </div>

                    <div className="space-y-2 border border-gray-200 px-3 py-2 rounded-md">
                        <div className="font-bold">Khoa</div>
                        <Rate disabled allowHalf defaultValue={5} />
                        <div>This food is very good</div>
                        <div className="flex items-center gap-2">
                            <LikeOutlined />
                            Useful {true && "(1)"}
                        </div>
                    </div>
                </div>

                <div className="row-center">
                    <Button>Write a review for this product</Button>
                </div>

            </div>

            <div className="space-y-4 px-4">
                <h3 className="font-bold text-xl">
                    Comments
                </h3>

                <CommentInput
                    id={productId}
                    depth={0}
                    setScrolToBottom={onDisplayScrollToBottom}
                />

                <div className="flex flex-col gap-4 relative" ref={commentListRef} onScroll={onDisplayScrollToBottom}>
                    {commentIds.map(commentId => {

                        const comment = comments[commentId]

                        if (comment && comment.depth === 0)
                            return <CommentRow key={commentId} comment={comment} depth={0} productId={productId} setScrolToBottom={onDisplayScrollToBottom} />
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

                {commentPageInfo?.hasNextPage && <div className="row-center">
                    <Button onClick={onFetchMoreComments}>Show more comments</Button>
                </div>}
            </div>
        </section>

        <section className="w-[30%] rounded-md shadow space-y-8 px-4 py-8 bg-white sticky top-10 h-fit">
            <div className="font-bold text-2xl">
                {product.title}
            </div>
            <div className="font-semibold text-xl">
                {formatVnd(product.price)}
            </div>

            <Button type="primary" size="large">
                Add to cart
            </Button>
        </section>
    </main>
}

export default ProductDetails