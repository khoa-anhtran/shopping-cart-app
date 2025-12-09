import { CommentPostPayload } from "@/types"
import api from "./api"

export const fetchComments = async (productId: string, after?: string) => {
    const res = await api.get(`/api/comments/${productId}${after ? `?after=${after}` : ""}`)
    const data = res.data
    return data
}

export const postComment = async (productId: string, payload: CommentPostPayload) => {
    const res = await api.post(`api/comments/${productId}`, payload)
    const data = res.data
    return data
}