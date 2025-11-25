import { Comment, CommentPostPayload } from "@/types/comment"
import { useSelector } from "react-redux"
import { selectComments } from "../selectors"
import { CSSProperties, useCallback, useMemo, useState } from "react";
import { Collapse, CollapseProps } from "antd";
import { timeAgo } from "@/utils/helpers";
import useTheme from "@/hooks/useTheme";

type CommentRowProps = {
    comment: Comment;
    className?: string;
    onSendComment: (payload: CommentPostPayload) => void;
    depth: number;
}

const CommentRow = ({ comment, className, onSendComment, depth }: CommentRowProps) => {
    const comments = useSelector(selectComments)
    const { theme } = useTheme()
    const [text, setText] = useState("")
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
                        onSendComment={onSendComment}
                        depth={depth + 1}
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
    }, [comment, comments])

    return <div className={`px-4 mb-2 space-y-2 border-l border-gray-200 dark:text-white ${className}`}>
        <div className="flex gap-4 items-center justify-baseline">
            <div className="bg-black text-white rounded-full p-2 border border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path>
                </svg>
            </div>

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

            <p className="text-justify">
                {comment.text}
            </p>

            {comment.images?.length !== 0 &&
                <div className="flex gap-2 mb-2 overflow-x-auto bg-white w-full px-1 py-2">
                    {comment.images?.map(({ publicId, url }, index) => (
                        <div
                            key={index}
                            className="w-16 h-16 rounded-md overflow-hidden border border-gray-200"
                        >
                            <img
                                src={url}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            }

            <div className="space-y-2">
                <button className="cursor-pointer underline" onClick={() => setInputOpen(!isInputOpen)}>reply</button>

                {isInputOpen && <form className="row-center gap-2" onSubmit={(e) => {
                    e.preventDefault()
                    onSendComment({ depth: depth + 1, text, parentId: comment.id })
                    setText("")
                }}>
                    <div className="bg-black text-white rounded-full row-center py-2 px-2 border border-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" viewBox="0 0 24 24" >
                            <path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path>
                        </svg>
                    </div>

                    <input type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 border-b border-gray-300 focus-visible:outline-0 focus-visible:border-b-2 focus-visible:border-black px-1 py-2"
                    />

                    <button className="row-center cursor-pointer hover:opacity-60" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            fill="currentColor" viewBox="0 0 24 24" >
                            <path d="m2.6 10.42 7.64 3.34 3.34 7.64c.16.37.52.6.92.6h.05a1 1 0 0 0 .9-.69l5.5-17c.12-.36.02-.75-.24-1.01a.98.98 0 0 0-1.01-.24L2.69 8.55c-.4.13-.67.49-.69.9-.02.42.22.8.6.97m15.85-4.86-4.09 12.63-2.44-5.59c-.1-.23-.28-.41-.52-.52L5.81 9.64l12.63-4.09Z"></path>
                        </svg>
                    </button>
                </form>}


                {comment.replies.length === 0 ? "" :
                    <Collapse items={getItems(comment.replies.length)} ghost bordered={false}></Collapse>
                }

            </div>
        </div>
    </div >
}

export default CommentRow