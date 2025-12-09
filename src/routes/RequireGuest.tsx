import useUserInfo from "@/contexts/UserInfoContext/useUserInfo";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireGuest() {
    const { userId } = useUserInfo()

    if (userId) return <Navigate to="/" replace />;

    return <Outlet />;
}
