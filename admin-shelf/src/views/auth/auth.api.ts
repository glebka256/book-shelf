import * as authTypes from './auth.types';
import baseInstance from '@/config/axios';
import { getResponseError, BasicErrors } from './auth.errors';

export const getLoginStatus = async () => {
    try {
        await baseInstance.get('/auth/user');
        return true;
    } catch (error: unknown) {
        return false;
    }
}

export const getUserCredentials = async (): Promise<authTypes.User | authTypes.AuthError> => {
    try {
        const response = await baseInstance.get('auth/user');
  
        if (response.data) {
            return response.data as authTypes.User;
        } else {
            return {
                error: response.data.message || 'Retrieved empty user credentials.'
            };
        }
    } catch (error: unknown) {
        return { error: getResponseError(error) };
    }
}

export const requestRegister = async (query: authTypes.RegisterQuery): Promise<authTypes.AuthResult> => {
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

export const requestLogin = async (query: authTypes.LoginQuery): Promise<authTypes.AuthResult> => {
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

export const requestLogout = async (): Promise<authTypes.AuthResult> => {
    try {
        await baseInstance.post('auth/logout');

        return {
            status: true,
            message: "Logged out from account"
        }
    } catch (error: unknown) {
        return {
            status: false,
            message: BasicErrors.Network
        }
    }
}