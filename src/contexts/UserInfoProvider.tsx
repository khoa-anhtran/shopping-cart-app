import { AuthPayload } from "@/pages/auth/reducers";
import { postLogin, postLogout, postRefreshToken } from "@/services/authService";
import { notify } from "@/utils/helpers";
import { useState, ReactNode, useCallback } from "react";
import AuthContext from "./UserInfoContext";
import { useDispatch } from "react-redux";
import { tokenAdded, tokenRemoved } from "@/pages/auth/actions";
import store from "@/store/store";

const UserInfoProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch()
    const [userId, setUserId] = useState<null | number>(null);
    const [email, setEmail] = useState<null | string>(null);

    const registerAction = useCallback(async (authPayload: AuthPayload) => {
        try {
            const data = await postLogin(authPayload)

            if (data) {
                const { email, id } = data.user
                setUserId(id);
                setEmail(email)
                notify({ status: "succeeded", message: "Register successfully" })
                dispatch(tokenAdded(data.accessToken))
                return;
            }

        } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            return error
        }
    }, [])

    const loginAction = useCallback(async (authPayload: AuthPayload) => {
        try {
            const data = await postLogin(authPayload)

            if (data) {
                const { email, id } = data.user
                setUserId(id);
                setEmail(email)
                dispatch(tokenAdded(data.accessToken))
                return;
            }

        } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            return error
        }
    }, [])

    const logOut = useCallback(async () => {
        await postLogout()
        dispatch(tokenRemoved())
        setUserId(null);
        setEmail(null);
    }, []);

    const refreshAction = useCallback(async () => {
        try {
            const data = await postRefreshToken()

            if (data) {
                const { email, id } = data.user
                setUserId(id);
                setEmail(email)
                dispatch(tokenAdded(data.accessToken))
                return;
            }

        } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            throw error
        }
    }, [])

    return (
        <AuthContext value={{ userId, email, loginAction, registerAction, refreshAction, logOut }}>
            {children}
        </AuthContext>
    );

};

export default UserInfoProvider