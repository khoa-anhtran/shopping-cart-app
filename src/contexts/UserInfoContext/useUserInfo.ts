import UserInfoContext from "./UserInfoContext";
import { useContext } from "react";

export default function useUserInfo() {
    const ctx = useContext(UserInfoContext);
    if (!ctx) throw new Error("useUserInfo must be used within <UserInfoProvider>");
    return ctx
};