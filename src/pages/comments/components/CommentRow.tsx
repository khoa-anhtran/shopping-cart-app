import { Comment } from "@/types/comment"

const CommentRow = ({ comment }: { comment: Comment }) => {
    return <div className="flex gap-4 border border-gray-300 px-2 py-2 rounded-md">
        <div>
            <div className="bg-black text-white rounded-full p-2 border border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path>
                </svg>
            </div>
        </div>
        <div className="space-y-2 flex-1">
            <div className="font-bold">
                {comment.user.name}
            </div>
            <div>
                {comment.text}
            </div>
            <div>
                <button className="cursor-pointer underline">reply</button>
            </div>
            <div className="hidden">
                <textarea name="" id="" className="whitespace-pre-wrap w-full"></textarea>
            </div>
        </div>
    </div>
}

export default CommentRow