import axios from "axios"
import api from "./api"
import { SignatureResponse } from "@/types"

export const postGetImageSignature = async (productId: string): Promise<SignatureResponse> => {
    const res = await api.post(`/api/uploads/image-signature/${productId}`)

    return res.data
}

export const postUploadImage = async (cloudName: string, fd: FormData) => {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const res = await axios.post(uploadUrl, fd)

    const data = res.data

    return {
        url: data.secure_url as string,
        publicId: data.public_id as string,
    };
}