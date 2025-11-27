import { AuthPayload } from "@/pages/auth/reducers";
import { getUserInfo, postLogin, postLogout, postRefreshToken } from "@/services/authService";
import { useState, ReactNode, useCallback } from "react";
import { config } from "@/msal/config";
import { useDispatch } from "react-redux";
import { tokenAdded } from "@/pages/auth/actions";
import { getApiToken, initAccount, msalClient } from "@/msal";
import UserInfoContext from "@/contexts/UserInfoContext";

const UserInfoProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch()

    const [userId, setUserId] = useState<null | string>(null);
    const [email, setEmail] = useState<null | string>(null);
    const [name, setName] = useState<null | string>(null);
    const [avatar, setAvatar] = useState<null | string | undefined>(null);

    const { apiScope, scopes } = config

    const registerAction = useCallback(async (authPayload: AuthPayload) => {
        try {
            const data = await postLogin(authPayload)

            if (data) {
                const { email, id, name, avatar } = data.user
                setUserId(id);
                setEmail(email)
                setName(name)
                setAvatar(avatar)
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
            const data = await msalClient.loginPopup({ scopes })

            const { accessToken } = await msalClient.acquireTokenSilent({ scopes: [apiScope] })
                .catch(() => msalClient.acquireTokenPopup({ scopes: [apiScope] }));

            if (data) {
                const { username } = data.account
                const res = await getUserInfo(accessToken)

                if (res) {
                    const { userId } = res?.user

                    setUserId(userId);
                    setEmail(username)
                    dispatch(tokenAdded(accessToken))
                }

                return;
            }

        } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            return error
        }
    }, [dispatch, apiScope, scopes])

    const logOut = useCallback(async () => {
        const account = msalClient.getActiveAccount();

        if (account) {
            await msalClient.logoutPopup({ account })
            msalClient.clearCache()
        }

        await postLogout()

        setUserId(null);
        setName(null)
        setEmail(null);
    }, []);

    const refreshAction = useCallback(async () => {
        try {
            const data = await postRefreshToken()

            if (data) {
                const { email, id, name, avatar } = data.user
                setUserId(id);
                setName(name)
                setEmail(email)
                setAvatar(avatar)
                return;
            }

        } catch (err) {
            const currentAccount = initAccount()

            if (currentAccount) {
                const { accessToken } = await getApiToken(apiScope)

                const res = await getUserInfo(accessToken)

                if (res) {
                    const { email, userId, name } = res.user
                    setUserId(userId);
                    setEmail(email)
                    setName(name)
                    dispatch(tokenAdded(accessToken))
                }


            }
            else {
                const error = err instanceof Error ? err.message : String(err);
                throw error
            }
        }
    }, [dispatch, apiScope])

    return (
        <UserInfoContext value={{ userId, name, email, avatar, loginAction, registerAction, refreshAction, logOut, MSLoginAction }}>
            {children}
        </UserInfoContext>
    );

};

export default UserInfoProvider