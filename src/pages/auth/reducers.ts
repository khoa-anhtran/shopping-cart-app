import { FetchStatus, PayloadAction } from "@/types";
import { USER_LOGIN_FAILED, USER_LOGIN_SUCCEEDED, USER_LOGINED, USER_LOGOUTED, USER_REGISTER_FAILED, USER_REGISTER_SUCCEEDED, USER_REGISTERED } from "./actionTypes";

export type AuthState = {
    userId: number | null;
    email: string | null;
    accessToken?: string
    status: FetchStatus
    error: string | null;
}

export type AuthResponse = {
    accessToken: string;
    user: {
        id: number;
        email: string;
    }
}

export type AuthPayload = {
    email: string;
    password: string
}

const initialState: AuthState = {
    userId: null,
    email: null,
    status: 'idle',
    error: null,
}

const authReducer = (state = initialState, action: PayloadAction<any>): AuthState => {
    switch (action.type) {

        case USER_LOGINED: {
            return {
                ...state,
                status: 'loading'
            };
        }

        case USER_LOGIN_SUCCEEDED: {
            const { accessToken, user } = action.payload as AuthResponse;

            return {
                ...state,
                accessToken,
                email: user.email,
                userId: user.id,
                status: "succeeded"
            };
        }

        case USER_LOGIN_FAILED: {
            const { message } = action.payload;

            return {
                ...state,
                status: "failed",
                error: message
            };
        }

        case USER_REGISTERED: {
            return {
                ...state,
                status: 'loading'
            };
        }

        case USER_REGISTER_SUCCEEDED: {
            const { accessToken, user } = action.payload as AuthResponse;

            return {
                ...state,
                accessToken,
                email: user.email,
                userId: user.id,
                status: "succeeded"
            };
        }

        case USER_REGISTER_FAILED: {
            const { message } = action.payload;

            return {
                ...state,
                status: "failed",
                error: message
            };
        }

        case USER_LOGOUTED: {
            return initialState;
        }

        default:
            return state
    }
}

export default authReducer