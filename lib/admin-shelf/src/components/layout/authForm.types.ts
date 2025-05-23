export interface AuthField {
    name: string,
    label: string,
    type: 'text' | 'number' | 'date' | 'email' | 'password',
    placeholder: string
}