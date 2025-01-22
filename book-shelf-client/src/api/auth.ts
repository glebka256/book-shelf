import baseInstance from "./baseInstance";
import { AuthError, User, RegisterQuery, AuthResult, LoginQuery } from '@/types/Auth'; 
import { getResponseError } from "./main";

export const getLoginStatus = async () => {
    try {
        await baseInstance.get('/auth/user');
        return true;
    } catch (error: unknown) {
        return false;
    }
}

export const getUserCredentials = async (): Promise<User | AuthError> => {
    try {
        const response = await baseInstance.get('auth/user');
  
        if (response.data) {
            return response.data as User;
        } else {
            return {
                error: response.data.message || 'Retrieved empty user credentials.'
            };
        }
    } catch (error: unknown) {
        return { error: getResponseError(error) };
    }
}

export const requestRegister = async (query: RegisterQuery): Promise<AuthResult> => {
    try {
        await baseInstance.post('auth/register', query);

        return {
            status: true,
            message: `Registered with email: ${query.email}`
        };
    } catch (error: unknown) {
        return {
            status: false,
            message: getResponseError(error)
        }
    }
}

export const requestLogin = async (query: LoginQuery): Promise<AuthResult> => {
    try {
        const response = await baseInstance.post('auth/login', query); 

        return {
            status: true,
            message: `${response.data.message}: ${response.data.user}`
        };
    } catch (error: unknown) {
        return {
            status: false,
            message: getResponseError(error)
        }
    }
}
