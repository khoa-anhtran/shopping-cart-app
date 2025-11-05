// RequireGuest.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, selectAuthStatus } from "@/pages/auth/selectors";

export default function RequireGuest() {
    const auth = useSelector(selectAuth);
    const status = useSelector(selectAuthStatus);

    const loading = (status === "loading");
    if (loading) return null; // or a spinner

    if (auth?.userId) return <Navigate to="/" replace />;

    return <Outlet />;
}
