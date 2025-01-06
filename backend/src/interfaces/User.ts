export interface User {
    username: string,
    email: string,
    authentication: {
        sessionToken: string
    }
}

export interface DecodedJWT {
    userId: string,
    username: string,
    iat: number,
    exp: number
}
