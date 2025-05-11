import * as authTypes from './auth.types';
import { AuthAPI } from './auth.api';

export interface AuthService {
    /**
     * Handles user registration on the server.
     * Validates data then sends to server and formats result message.
     * 
     * @param formData - Registration data from HTML form. Valid form includes:
     *   - 'username'
     *   - 'email' 
     *   - 'password'
     *   - 'pass-match'
     * 
     * @returns Promise showing completion status and fail/success message.
     */
    register: (formData: Record<string, string>) => Promise<authTypes.AuthResult>;

    /**
     * Handles user login on the server.
     * Validates data then sends to server and formats result message.
     * 
     * @param formData - Login data from HTML form. Valid form includes:
     *   - 'email'
     *   - 'password'
     * 
     * @returns Promise showing completion status and fail/success message.
     */
    login: (formData: Record<string, string>) => Promise<authTypes.AuthResult>;

    /**
     * Logs out the current user.
     * 
     * @returns Promise showing completion status and fail/success message.
     */
    logout: () => Promise<authTypes.AuthResult>;
}

/**
 * Creates an authentication service with form validation and API integration
 * 
 * @param authAPI - The authentication API instance to use
 * @returns An object with authentication service methods
 */
export const useAuthService = (authAPI: AuthAPI): AuthService => {
    const OK_MESSAGE = 'OK';

    const validateUsername = (username: string | undefined): string | null => {
        if (!username) {
            return 'Username is required.';
        }
        if (username.length < 5 || username.length > 20) {
            return 'Username should be between 5 and 20 characters in length.';
        }
        return null;
    };

    const validateEmail = (email: string | undefined): string | null => {
        if (!email) {
            return 'Email is required.';
        }
        if (!email.includes('@') || !email.includes('.')) {
            return 'Email must be valid, like: username@domain.com';
        }
        return null;
    };

    const validatePassword = (password: string | undefined): string | null => {
        if (!password) {
            return 'Password is required.';
        }
        if (password.length < 8) {
            return 'Password must be at least 8 characters long.';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must include at least one number.';
        }
        return null;
    };

    const validatePasswordMatch = (
        password: string | undefined,
        passMatch: string | undefined
    ): string | null => {
        if (passMatch !== password) {
            return 'Passwords do not match.';
        }
        return null;
    };

    const getRegisterValidation = (formData: Record<string, string>): string => {
        const { username, email, password, ['pass-match']: passMatch } = formData;
        return (
            validateUsername(username) ||
            validateEmail(email) ||
            validatePassword(password) ||
            validatePasswordMatch(password, passMatch) ||
            OK_MESSAGE
        );
    };

    const getLoginValidation = (formData: Record<string, string>): string => {
        const { email, password } = formData;

        if (!email) {
            return 'Email is required!';
        }
        if (!password) {
            return 'Password is required!';
        }
        return OK_MESSAGE;
    };

    const register = async (formData: Record<string, string>): Promise<authTypes.AuthResult> => {
        const validationMessage = getRegisterValidation(formData);
        if (validationMessage === OK_MESSAGE) {
            const query: authTypes.RegisterQuery = {
                username: formData.username,
                email: formData.email,
                password: formData.password
            }
            return await authAPI.requestRegister(query);
        } else {
            return {
                status: false,
                message: validationMessage
            }
        }
    };

    const login = async (formData: Record<string, string>): Promise<authTypes.AuthResult> => {
        const validationMessage = getLoginValidation(formData);
        if (validationMessage === OK_MESSAGE) {
            const query: authTypes.LoginQuery = {
                email: formData.email,
                password: formData.password
            }
            return await authAPI.requestLogin(query);
        } else {
            return {
                status: false,
                message: validationMessage
            }
        }
    };

    const logout = async (): Promise<authTypes.AuthResult> => {
        return await authAPI.requestLogout();
    };

    return {
        register,
        login,
        logout
    };
};