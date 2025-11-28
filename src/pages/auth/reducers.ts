import { PayloadAction } from "@/types";
import { TOKEN_ADDED, TOKEN_REMOVED } from "./actionTypes";
import { AuthPayloadAction, AuthState } from "@/types/auth";

const initialState: AuthState = {}


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