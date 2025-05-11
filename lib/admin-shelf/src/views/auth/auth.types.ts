export interface User {
    username: string,
    email: string
}

export interface AuthError {
    error: string
}

export interface RegisterQuery {
    username: string,
    email: string,
    password: string
}

export interface LoginQuery {
    email: string,
    password: string
}

export interface AuthResult {
    status: boolean,
    message: string
}