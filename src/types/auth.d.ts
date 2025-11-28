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

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
}

export type AuthPayloadAction = PayloadAction<{ token?: string }>
