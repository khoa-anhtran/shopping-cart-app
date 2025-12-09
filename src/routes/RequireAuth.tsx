import useUserInfo from "@/contexts/UserInfoContext/useUserInfo";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
    const { userId } = useUserInfo()

    if (!userId) return <Navigate to="/login" replace />;

    return <Outlet />
}
