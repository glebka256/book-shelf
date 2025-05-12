import * as authTypes from './auth.types';
import { getResponseError, BasicErrors } from './auth.errors';
import { AxiosInstance } from 'axios';

export interface AuthAPI {
    /**
     * Checks if the user is currently logged in
     * @returns Promise resolving to boolean indicating login status
     */
    getLoginStatus: () => Promise<boolean>;

    /**
     * Retrieves the currently logged in user's credentials
     * @returns Promise resolving to either User data or AuthError
     */
    getUserCredentials: () => Promise<authTypes.User | authTypes.AuthError>;

    /**
     * Registers a new user
     * @param query Registration data containing email, password, etc.
     * @returns Promise resolving to AuthResult with status and message
     */
    requestRegister: (query: authTypes.RegisterQuery) => Promise<authTypes.AuthResult>;

    /**
     * Logs in a user
     * @param query Login credentials containing email/username and password
     * @returns Promise resolving to AuthResult with status and message
     */
    requestLogin: (query: authTypes.LoginQuery) => Promise<authTypes.AuthResult>;

    /**
     * Logs out the current user
     * @returns Promise resolving to AuthResult with status and message
     */
    requestLogout: () => Promise<authTypes.AuthResult>;

    /**
   * Deletes current logged in account
   * @returns Promise resolving to AuthResult with status and message
   */
    requestDelete: () => Promise<authTypes.AuthResult>;
}

/** Provide axios instance of api on which authentication will run */
export const useAuthAPI = (baseInstance: AxiosInstance): AuthAPI => {
    const getLoginStatus = async () => {
        try {
            await baseInstance.get('/auth/user');
            return true;
        } catch (error: unknown) {
            return false;
        }
    }

    const getUserCredentials = async (): Promise<authTypes.User | authTypes.AuthError> => {
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

    const requestRegister = async (query: authTypes.RegisterQuery): Promise<authTypes.AuthResult> => {
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

    const requestLogin = async (query: authTypes.LoginQuery): Promise<authTypes.AuthResult> => {
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

    const requestLogout = async (): Promise<authTypes.AuthResult> => {
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

    const requestDelete = async (): Promise<authTypes.AuthResult> => {
        try {
            const response = await baseInstance.delete('auth/user');

            return {
                status: true,
                message: response.data.message || "Succesfully deleted current user"
            };
        } catch (error: unknown) {
            return {
                status: false,
                message: BasicErrors.Network
            }
        }
    }

    return {
        getLoginStatus,
        getUserCredentials,
        requestRegister,
        requestLogin,
        requestLogout,
        requestDelete
    }
}