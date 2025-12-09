import { AuthPayload, RegisterPayload } from "@/types";
import { createContext } from "react";

export type UserInfoCtx = {
    userId: null | string,
    email: null | string,
    name: null | string,
    avatar: null | string | undefined,
    loginAction: (payload: AuthPayload) => Promise<void | string>,
    registerAction: (payload: RegisterPayload) => Promise<void | string>,
    refreshAction: () => Promise<void>
    logOut: () => Promise<void>
    MSLoginAction: () => Promise<void | string>
    googleLoginAction: () => void
}

const UserInfoContext = createContext<UserInfoCtx | undefined>(undefined);

export default UserInfoContext
