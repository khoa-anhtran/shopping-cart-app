import { RootState } from "@/store/store";

export const selectAuth = (state: RootState) => state.auth

export const selectAuthError = (state: RootState) => state.auth.error

export const selectAuthStatus = (state: RootState) => state.auth.status