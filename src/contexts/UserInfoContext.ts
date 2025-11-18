import { AuthPayload } from "@/pages/auth/reducers";
import { createContext } from "react";

export type UserInfoCtx = {
    userId: null | string,
    email: null | string,
    name: null | string,
    loginAction: (payload: AuthPayload) => Promise<void | string>,
    registerAction: (payload: AuthPayload) => Promise<void | string>,
    refreshAction: () => Promise<void>
    logOut: () => Promise<void>
    MSLoginAction: () => Promise<void | string>
}

const UserInfoContext = createContext<UserInfoCtx>({
    email: null,
    userId: null,
    name: null,
    loginAction: async () => { },
    registerAction: async () => { },
    refreshAction: async () => { },
    logOut: async () => { },
    MSLoginAction: async () => { }
});

export default UserInfoContext
