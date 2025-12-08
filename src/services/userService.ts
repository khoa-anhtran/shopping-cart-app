import api from "./api"

export const postUpdateUserInfo = async (userId: string, data: { name: string, avatar?: string }) => {
    const res = await api.post(`/api/users/${userId}`, data)

    return res.data
}