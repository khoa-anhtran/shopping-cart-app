import { AuthPayload } from "@/pages/auth/reducers";
import { getUserInfo, postLogin, postLogout, postRefreshToken } from "@/services/authService";
import { useState, ReactNode, useCallback } from "react";
import UserInfoContext from "./UserInfoContext";
import { PublicClientApplication } from "@azure/msal-browser";
import { config } from "@/config";
import { useDispatch } from "react-redux";
import { tokenAdded } from "@/pages/auth/actions";
import { getApiToken, initAccount, msalClient } from "@/msal";

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
                return;
            }

        } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            return error
        }
    }, [])

    const MSLoginAction = useCallback(async () => {
        try {
            const { scopes } = config

            const data = await msalClient.loginPopup({ scopes })

            const API_SCOPE = "api://3641fc9d-2752-4e3e-9d1b-3e012410ed0a/access_as_user";

            const { accessToken } = await msalClient.acquireTokenSilent({ scopes: [API_SCOPE] })
                .catch(() => msalClient.acquireTokenPopup({ scopes: [API_SCOPE] }));

            if (data) {
                const { username, tenantId } = data.account
                const { userId } = await getUserInfo(accessToken) as { userId: number }

                setUserId(userId);
                setEmail(username)
                dispatch(tokenAdded(accessToken))
                return;
            }

        } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            return error
        }
    }, [])

    const logOut = useCallback(async () => {
        const account = msalClient.getActiveAccount();

        if (account) {
            await msalClient.logoutPopup({ account })
            msalClient.clearCache()

        }

        await postLogout()

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
                return;
            }

        } catch (err) {

            const API_SCOPE = "api://3641fc9d-2752-4e3e-9d1b-3e012410ed0a/access_as_user";

            const currentAccount = initAccount()

            if (currentAccount) {
                const { accessToken, email } = await getApiToken(API_SCOPE)

                const data = await getUserInfo(accessToken)

                if (data) {
                    setUserId(data.userId);
                    setEmail(email)
                    dispatch(tokenAdded(accessToken))
                }
            }
            else {
                const error = err instanceof Error ? err.message : String(err);
                throw error
            }
        }
    }, [])

    return (
        <UserInfoContext value={{ userId, email, loginAction, registerAction, refreshAction, logOut, MSLoginAction }}>
            {children}
        </UserInfoContext>
    );

};

export default UserInfoProvider