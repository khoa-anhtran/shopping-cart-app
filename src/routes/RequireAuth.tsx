import useUserInfo from "@/hooks/useUserInfo";
import { selectToken } from "@/pages/auth/selectors";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
    const token = useSelector(selectToken)
    const { userId } = useUserInfo()

    if (!userId) return <Navigate to="/login" replace />;

    return <Outlet />
}
