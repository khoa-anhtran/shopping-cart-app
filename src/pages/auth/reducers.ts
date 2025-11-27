import { PayloadAction } from "@/types";
import { TOKEN_ADDED, TOKEN_REMOVED } from "./actionTypes";

export type AuthState = {
    token?: string
}

export type AuthResponse = {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        avatar?: string;
    }
}

export type AuthPayload = {
    email: string;
    password: string
}

const initialState: AuthState = {}

type AuthPayloadAction = PayloadAction<{ token?: string }>

const authReducer = (state = initialState, action: AuthPayloadAction): AuthState => {
    switch (action.type) {

        case TOKEN_ADDED: {
            const { token } = action.payload!

            return { ...state, token }
        }

        case TOKEN_REMOVED: {
            return initialState
        }

        default:
            return state
    }
}

export default authReducer