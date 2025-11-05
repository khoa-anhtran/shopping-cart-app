// RequireAuth.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { notification } from "antd";
import { selectAuth, selectAuthError, selectAuthStatus } from "@/pages/auth/selectors";
import { accessTokenRefreshRequested } from "@/pages/auth/actions";

export default function RequireAuth() {
    const auth = useSelector(selectAuth);
    const status = useSelector(selectAuthStatus);

    // While we haven't decided yet (refresh in progress) -> block routing
    const loading = (status === "loading") && !auth?.userId;
    if (loading) return null; // or a spinner

    if (!auth?.userId) return <Navigate to="/login" replace />;

    return <Outlet />; // render children routes
}
