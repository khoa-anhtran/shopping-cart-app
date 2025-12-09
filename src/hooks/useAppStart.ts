import { selectToken } from "@/pages/auth/selectors";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUserInfo } from "../contexts/UserInfoContext";
import { msalClient } from "@/msal";

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

    useEffect(() => {
        (async () => {
            await msalClient.initialize()
        })()
    }, [])

    return { userId }
}