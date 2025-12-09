import { Comment } from "@/types";
import { useCallback, useRef, useState } from "react"
import { useDispatch } from "react-redux";
import { commentPosted } from "../actions";
import { useUserInfo } from "@/contexts/UserInfoContext";
import { FileImageOutlined } from "@ant-design/icons";
import { Image } from "antd";

type CommentInputProps = {
    id: string,
    depth: number;
    parentId?: string;
    setScrolToBottom: () => void;
}

const CommentInput = ({ id, depth, parentId, setScrolToBottom }: CommentInputProps) => {
    const dispatch = useDispatch()

    const { userId, name, avatar } = useUserInfo()

    const [text, setText] = useState("")
    const [previews, setPreviews] = useState<{ url: string, type: string }[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    const formRef = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const list = Array.from(e.target.files ?? []);
        setFiles(list);

        const previewObjects = list.map((file) => ({ url: URL.createObjectURL(file), type: file.type }));
        setPreviews(previewObjects);
    }, [])

    const onRemoveFile = useCallback((index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));

        const input = fileInputRef.current;
        if (!input || !input.files) return;

        const dt = new DataTransfer();
        Array.from(input.files).forEach((file, i) => {
            if (i !== index) dt.items.add(file);
        });

        input.files = dt.files;
    }, [])

    const onResetInput = useCallback(() => {
        const input = fileInputRef.current;
        if (!input || !input.files) return;

        const dt = new DataTransfer();
        input.files = dt.files
        previews.forEach((obj) => URL.revokeObjectURL(obj.url))
        setPreviews([])
        setFiles([])
        setText("")
    }, [previews])

    const onSendComment = useCallback((comment: Comment, files: File[]) => {
        dispatch(commentPosted(id, comment, files))
    }, [id, dispatch])

    return <form ref={formRef} className="h-[15%] flex flex-col border-t border-gray-200 py-1 relative" onSubmit={async (e) => {
        e.preventDefault()
        if (text || files.length !== 0) {
            onSendComment({
                text,
                depth,
                parentId,
                id: crypto.randomUUID(),
                replies: [],
                media: new Array(files.length).fill(""),
                user: { id: userId ?? "", name: name ?? "", avatar: avatar ?? undefined },
                isPending: true,
                createdAt: new Date()
            }, files)

            onResetInput()
            setScrolToBottom()
        }
    }}>
        {previews.length > 0 && (
            <div className="flex gap-2 mb-2 overflow-x-auto absolute -top-[80%] bg-white shadow-xl w-full px-1 py-2 max-w-full">
                {previews.map(({ type, url }, index) => (
                    <div
                        key={index}
                        className="w-16 h-16 rounded-md border border-gray-200 relative shrink-0"
                    >
                        {type.startsWith("image") ? <Image
                            src={url}
                            alt="preview"
                            className="w-full h-full object-cover"
                            fallback="/error_image.png"
                        /> : <video
                            src={url}
                            className="w-full h-full object-cover"
                        />}

                        <button className="absolute top-0 right-0 cursor-pointer hover:bg-gray-100 hover:opacity-70" type="button"
                            onClick={() => onRemoveFile(index)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="currentColor" viewBox="0 0 24 24" >
                                <path d="m7.76 14.83-2.83 2.83 1.41 1.41 2.83-2.83 2.12-2.12.71-.71.71.71 1.41 1.42 3.54 3.53 1.41-1.41-3.53-3.54-1.42-1.41-.71-.71 5.66-5.66-1.41-1.41L12 10.59 6.34 4.93 4.93 6.34 10.59 12l-.71.71z"></path>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        )}

        <div className="row-center flex-1 gap-2">
            <div className="bg-black text-white rounded-full row-center px-1 py-1 border border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                    fill="currentColor" viewBox="0 0 24 24" >
                    <path d="M12 2a5 5 0 1 0 0 10 5 5 0 1 0 0-10M4 22h16c.55 0 1-.45 1-1v-1c0-3.86-3.14-7-7-7h-4c-3.86 0-7 3.14-7 7v1c0 .55.45 1 1 1"></path>
                </svg>
            </div>

            <textarea
                placeholder="Write a comment..."
                className="flex-1 border-none outline-none text-sm placeholder-gray-400 bg-transparent resize-none h-full"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault()
                        formRef.current?.requestSubmit()
                    }
                }}
                rows={3}
            />
        </div>

        <div className="flex w-full items-center justify-between h-fit">
            <div className="flex gap-2">
                <label htmlFor="images" className="hover:bg-gray-200 p-1 border border-gray-200 cursor-pointer block rounded-md">
                    <FileImageOutlined className="text-xl" />
                </label>

                <input ref={fileInputRef} type="file" multiple name="images" id="images" accept="image/*,video/*" className="hidden" onChange={onFileChange} />
            </div>
            <button className="px-2 py-1 bg-blue-500 text-gray-200 rounded-md cursor-pointer hover:opacity-70 text-xs" type="submit">SEND</button>
        </div>

    </form>
}

export default CommentInput