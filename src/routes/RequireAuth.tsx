// RequireAuth.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth, selectAuthStatus } from "@/pages/auth/selectors";

export default function RequireAuth() {
    const auth = useSelector(selectAuth);
    const status = useSelector(selectAuthStatus);

    // While we haven't decided yet (refresh in progress) -> block routing
    const loading = (status === "loading") && !auth?.userId;
    if (loading) return null; // or a spinner

    if (!auth?.userId) return <Navigate to="/login" replace />;

    return <Outlet />; // render children routes
}
