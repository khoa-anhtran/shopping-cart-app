import { Comment } from "@/types/comment"
import { useSelector } from "react-redux"
import { selectComments } from "../selectors"
import { useCallback, useEffect, useState } from "react";
import { Collapse, CollapseProps, Image, Skeleton } from "antd";
import { timeAgo } from "@/utils/helpers";
import CommentInput from "./CommentInput";
import React from "react";
import { useDispatch } from "react-redux";
import { mediaViewerOpened } from "@/pages/product-details/actions";
import { useTheme } from "@/contexts/ThemeContext";

type CommentRowProps = {
    comment: Comment;
    className?: string;
    depth: number;
    productId: string;
    setScrolToBottom: () => void;
}

const CommentRow = React.memo(({ comment, className, depth, productId, setScrolToBottom }: CommentRowProps) => {
    const dispatch = useDispatch()
    const comments = useSelector(selectComments)
    const { theme } = useTheme()
    const [isInputOpen, setInputOpen] = useState(false)

    const getItems = useCallback((numberOfReplies: number) => {
        const items: CollapseProps['items'] = [
            {
                key: comment.id,
                label: `${numberOfReplies} ${numberOfReplies > 1 ? "replies" : "reply"} `,
                children: <>{comment.replies.map((id =>
                    <CommentRow
                        key={id}
                        comment={comments[id]}
                        depth={depth + 1}
                        productId={productId}
                        setScrolToBottom={setScrolToBottom}
                    />))}
                </>,
                classNames: {
                    header: 'my-classname',
                    body: 'my-classname'
                },
                styles: {
                    header: {
                        padding: "0.5rem 0",
                        color: theme === "dark" ? "white" : "black"
                    },
                    body: {
                        padding: 0
                    }
                },
            },]

        return items
    }, [comment, comments, depth, productId, setScrolToBottom, theme])

    useEffect(() => {
        setInputOpen(false)
    }, [comments])

    return <div className={`px-4 mb-2 space-y-2 border-l border-gray-200 dark:text-white ${className} ${comment.isPending && "opacity-50"}`}>
        <div className="flex gap-4 items-center justify-baseline">
            {comment.user.avatar ? <div>
                <Image
                    className="w-12! h-12! rounded-full!"
                    fallback="/error_image.png"
                    src={comment.user.avatar} alt=""
                />
            </div>
                :
                <div className="bg-gray-300 text-white rounded-full p-2 border border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        fill="currentColor" viewBox="0 0 24 24" >
                        <path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path>
                    </svg>
                </div>}
            <div>
                <div className="font-bold">
                    {comment.user.name}
                </div>
                <div className="text-gray-400 text-sm">
                    {timeAgo(comment.createdAt!)}
                </div>
            </div>
        </div>

        <div className="space-y-2 flex-1">

            <p className="text-justify whitespace-pre-wrap wrap-anywhere">
                {comment.text}
            </p>

            {comment.media && comment.media.length !== 0 &&
                (comment.isPending ?
                    <div className="flex gap-2 mb-2 overflow-x-auto bg-white w-full px-1 py-2">
                        {comment.media.map((_, index) => (
                            <div
                                key={index}
                                className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 row-center shrink-0"
                            >
                                <Skeleton.Image active />
                            </div>
                        ))}
                    </div> : <div className="flex gap-2 mb-2 overflow-x-auto bg-white w-full px-1 py-2">
                        {comment.media?.map(({ url, mediaType }, index) => (
                            <div
                                key={index}
                                className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 hover:opacity-80 cursor-pointer shrink-0"
                                onClick={() => {
                                    dispatch(mediaViewerOpened(comment.media!, index))
                                }}
                            >
                                {mediaType.startsWith("image") ? <Image
                                    src={url}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                    preview={false}
                                    fallback="/error_image.png"
                                /> : <video
                                    src={url}
                                    className="w-full h-full object-cover"
                                />}

                            </div>
                        ))}
                    </div>)
            }

            <div className="space-y-2">
                <button className="cursor-pointer underline" onClick={() => setInputOpen(!isInputOpen)} disabled={comment.isPending}>reply</button>

                {isInputOpen && <CommentInput key={comment.id} id={productId} depth={depth + 1} parentId={comment.id} setScrolToBottom={setScrolToBottom}></CommentInput>}

                {comment.replies.length === 0 ? "" :
                    <Collapse items={getItems(comment.replies.length)} ghost bordered={false}></Collapse>
                }

            </div>
        </div>
    </div>
})

export default CommentRow