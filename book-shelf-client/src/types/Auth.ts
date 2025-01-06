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
