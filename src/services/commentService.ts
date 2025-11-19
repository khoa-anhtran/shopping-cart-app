import api from "./api"

export const fetchComments = async (productId: string) => {
    const res = await api.get(`/api/comments/${productId}`)
    const data = res.data
    return data
}