import { selectToken } from "@/pages/auth/selectors";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import useUserInfo from "./useUserInfo";

export const useAppStart = () => {
    const { userId, refreshAction, logOut } = useUserInfo()
    const ran = useRef(false)
    const token = useSelector(selectToken)

    // refresh token when first access to website
    useEffect(() => {
        (async () => {
            if (!userId && !ran.current) {
                ran.current = true
                await refreshAction()
            };
        })();
    }, [userId, refreshAction]);

    // clear state o userInfoContext
    useEffect(() => {
        (async () => {
            if (!token && userId) {
                await logOut()
            };
        })();
    }, [token, logOut, userId])

    return { userId }
}