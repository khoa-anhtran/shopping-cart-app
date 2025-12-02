import { Commune, Province } from "@/types/payment"
import axios from "axios"

export const fetchProvinces = async (): Promise<Province[]> => {
    const res = await axios.get("https://production.cas.so/address-kit/latest/provinces", { headers: { "Access-Control-Allow-Origin": "*" } })

    return res.data.provinces
}

export const fetchCommunes = async (provinceCode: string): Promise<Commune[]> => {
    const res = await axios.get(`https://production.cas.so/address-kit/latest/provinces/${provinceCode}/communes`)
    return res.data.communes
}