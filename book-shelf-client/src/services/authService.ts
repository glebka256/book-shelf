import { requestLogin, requestRegister } from "@/api/auth";
import { AuthResult, LoginQuery, RegisterQuery } from "@/types/Auth";

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

/** Handles user registration on the server.
 * Validates data then sends to server and formats result message.
 * @param {Record<string, string>} formData - Registration data from HTML form. Valid form includes:
 * - 'username'
 * - 'email'
 * - 'password'
 * - 'pass-match'
 * 
 * @returns Promise showing completion status and fail/success message.
*/
export const register = async (formData: Record<string, string>): Promise<AuthResult> => {
    const validationMessage = getRegisterValidation(formData);

    if (validationMessage === OK_MESSAGE) {
        const query: RegisterQuery = {
            username: formData.username,
            email: formData.email,
            password: formData.password
        }

        return await requestRegister(query);
    } else {
        return {
            status: false,
            message: validationMessage
        }
    }
}

/** Handles user login on the server.
 * Validates data then sends to server and formats result message.
 * @param {Record<string, string>} formData - Login data from HTML form. Valid form includes:
 * - 'email'
 * - 'password'
 * 
 * @returns Promise showing completion status and fail/success message.
*/
export const login = async (formData: Record<string, string>): Promise<AuthResult> => {
    const validationMessage = getLoginValidation(formData);

    if (validationMessage === OK_MESSAGE) {
        const query: LoginQuery = {
            email: formData.email,
            password: formData.password
        }

        return await requestLogin(query);
    } else {
        return {
            status: false,
            message: validationMessage
        }
    }
}
