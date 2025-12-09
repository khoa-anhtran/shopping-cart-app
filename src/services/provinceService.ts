import { Commune, Province } from "@/types"
import api from "./api"

export const fetchProvinces = async (): Promise<Province[]> => {
    const res = await api.get("/api/address/provinces")

    return res.data
}

export const fetchCommunes = async (provinceCode: string): Promise<Commune[]> => {
    const res = await api.get(`/api/address/provinces/${provinceCode}`)
    return res.data
}