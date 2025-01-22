export interface User {
    username: string,
    email: string
}

export interface FormField {
    name: string,
    label: string,
    type: 'text' | 'number' | 'date' | 'email' | 'password',
    placeholder: string
}

export interface AuthError {
    error: string
}

export interface RegisterQuery {
    username: string,
    email: string,
    password: string
}

export interface AuthResult {
    status: boolean,
    message: string
}
