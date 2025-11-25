import { ImageWithPreview } from "@/components/ImageWithPreview"
import { Collapse, CollapseProps, Skeleton } from "antd"
import { useSelector } from "react-redux"
import { selectProducts } from "../selectors"
import { useDispatch } from "react-redux"
import { selectPDsModalOpen, selectProductIdOpen } from "@/pages/layout/ui/uiSelectors"
import { hidePDsModal } from "@/pages/layout/ui/uiActions"
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react"
import { selectCommentIds, selectComments } from "@/pages/comments/selectors"
import CommentRow from "@/pages/comments/components/CommentRow"
import { CommentPostPayload } from "@/types/comment"
import { commentPosted } from "@/pages/comments/actions"
import { useMediaQuery } from "react-responsive"
import useUserInfo from "@/hooks/useUserInfo"
import { itemAdded } from "@/pages/cart/actions"
import { SignatureResponse } from "@/types"
import api from "@/services/api"
import axios from "axios"

const ProductDetailsModal = () => {
    const products = useSelector(selectProducts)
    const open = useSelector(selectPDsModalOpen)
    const id = useSelector(selectProductIdOpen) ?? ""
    const comments = useSelector(selectComments)
    const commentIds = useSelector(selectCommentIds)
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

    const [text, setText] = useState("")
    const [previews, setPreviews] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);

    const dispatch = useDispatch()

    const previouslyFocused = useRef<HTMLElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const commentListRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const product = products[id]

    const onClickCloseModal = useCallback(() => {
        dispatch(hidePDsModal())
    }, [])

    const onSendComment = useCallback((payload: CommentPostPayload) => {
        dispatch(commentPosted(id, payload))
    }, [id])

    const { userId } = useUserInfo()

    const onAddToCart = useCallback(() => {
        dispatch(itemAdded(id, userId!))
    }, [dispatch, userId, id])


    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const list = Array.from(e.target.files ?? []);
        setFiles(list);

        // create preview URLs
        const urls = list.map((file) => URL.createObjectURL(file));
        setPreviews(urls);
    };

    const onRemoveFile = useCallback((index: number) => {
        // 1) Update React state (used for upload + previews)
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));

        // 2) (Optional) Update <input>.files so it matches state
        const input = fileInputRef.current;
        if (!input || !input.files) return;

        const dt = new DataTransfer();
        Array.from(input.files).forEach((file, i) => {
            if (i !== index) dt.items.add(file);
        });

        input.files = dt.files;
    }, [])

    const onResetFiles = useCallback(() => {
        const input = fileInputRef.current;
        if (!input || !input.files) return;

        const dt = new DataTransfer();
        input.files = dt.files
        previews.forEach((url) => URL.revokeObjectURL(url))
        setPreviews([])
        setFiles([])
    }, [])

    const uploadToCloudinary = useCallback(async () => {
        if (files.length === 0) return;

        // 1) get signature from NestJS
        const sigRes: SignatureResponse = await api.post(`/api/uploads/image-signature/${id}`).then((r) => r.data);

        const { timestamp, folder, signature, cloudName, apiKey } =
            sigRes;

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        // 2) upload all files in parallel
        const results = await Promise.all(
            files.map(async (file) => {
                const fd = new FormData();
                fd.append("file", file);
                fd.append("api_key", apiKey);
                fd.append("timestamp", String(timestamp));
                fd.append("folder", folder);
                fd.append("signature", signature);

                const res = await axios.post(uploadUrl, fd).then((r) => r.data);

                return {
                    url: res.secure_url as string,
                    publicId: res.public_id as string,
                };
            })
        );

        return {
            results
        };
    }, [id, files])

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

    // useEffect(() => {
    //     return () => {
    //         previews.forEach((url) => URL.revokeObjectURL(url));
    //     };
    // }, [previews]);

    if (!open)
        return <></>

    return <div
        className={`fixed inset-0 z-40 bg-black/50 flex items-center justify-center`}
        ref={modalRef}
        onClick={onClickCloseModal}
    >
        <div
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

                    <div className="flex flex-col md:overflow-y-scroll gap-4 md:h-[80%]" ref={commentListRef}>
                        {commentIds.map(commentId => {
                            const comment = comments[commentId]

                            if (comment && comment.depth === 0)
                                return <CommentRow key={commentId} comment={comment} className="" onSendComment={onSendComment} depth={0} />
                        })}

                    </div>

                    {/* my chat input here  */}
                    <form ref={formRef} className="h-[15%] flex flex-col border-t border-gray-200 py-1 relative" onSubmit={async (e) => {
                        e.preventDefault()
                        if (files.length !== 0) {
                            const res = await uploadToCloudinary()
                            onResetFiles()

                            console.log(res)
                        }
                        if (text) {
                            onSendComment({ depth: 0, text })
                            setText("")
                        }
                    }}>
                        {previews.length > 0 && (
                            <div className="flex gap-2 mb-2 overflow-x-auto absolute -top-22 bg-white shadow-xl w-full px-1 py-2">
                                {previews.map((url, index) => (
                                    <div
                                        key={index}
                                        className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 relative"
                                    >
                                        <img
                                            src={url}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
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

                            {/* <input type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="flex-1 border-b border-gray-300 focus-visible:outline-0 focus-visible:border-b-2 focus-visible:border-black px-1 py-2"
                            /> */}
                        </div>

                        <div className="flex w-full items-center justify-between h-fit">
                            <div>
                                <label htmlFor="images" className="hover:bg-gray-200 p-1 cursor-pointer block rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        fill="currentColor" viewBox="0 0 24 24" >
                                        <path d="M5 21h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2m0-2v-1.59l3-3 1.29 1.29c.39.39 1.02.39 1.41 0l5.29-5.29 3 3V19h-14ZM19 5v5.59L16.71 8.3a.996.996 0 0 0-1.41 0l-5.29 5.29-1.29-1.29a.996.996 0 0 0-1.41 0l-2.29 2.29V5h14Z"></path><path d="M8.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3"></path>
                                    </svg>
                                </label>
                                <input ref={fileInputRef} type="file" multiple name="images" id="images" accept="image/*" className="hidden" onChange={onFileChange} />
                            </div>
                            <button className="px-2 py-1 bg-blue-500 text-gray-200 rounded-md cursor-pointer hover:opacity-70 text-xs" type="submit">SEND</button>
                        </div>


                        {/* <button className="row-center cursor-pointer hover:opacity-60" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="currentColor" viewBox="0 0 24 24" >
                                <path d="m2.6 10.42 7.64 3.34 3.34 7.64c.16.37.52.6.92.6h.05a1 1 0 0 0 .9-.69l5.5-17c.12-.36.02-.75-.24-1.01a.98.98 0 0 0-1.01-.24L2.69 8.55c-.4.13-.67.49-.69.9-.02.42.22.8.6.97m15.85-4.86-4.09 12.63-2.44-5.59c-.1-.23-.28-.41-.52-.52L5.81 9.64l12.63-4.09Z"></path>
                            </svg>
                        </button> */}
                    </form>

                </div>
            </div>

            <div className="flex justify-end items-center gap-4 border-t border-gray-200 dark:border-gray-700 px-4 py-3 h-[5%] dark:text-white">
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
                    className="px-2 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-500 active:bg-green-700  cursor-pointer"
                    onClick={onAddToCart}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" >
                        <path d="M10.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M17.5 18a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3M8.82 15.77c.31.75 1.04 1.23 1.85 1.23h6.18c.79 0 1.51-.47 1.83-1.2l3.24-7.4c.14-.31.11-.67-.08-.95A1 1 0 0 0 21 7H7.33L5.92 3.62C5.76 3.25 5.4 3 5 3H2v2h2.33zM11 11h2V9h2v2h2v2h-2v2h-2v-2h-2z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>

}

export default ProductDetailsModal