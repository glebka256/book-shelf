import baseInstance from "./baseInstance";
import { AuthError, User } from '@/types/Auth'; 
import { getResponseError, replaceBasicError } from "@/api/main";

export const getLoginStatus = async () => {
    try {
        await baseInstance.get('/auth/user');
        return true;
    } catch (error: unknown) {
        return false;
    }
}

export const getUserData = async (): Promise<User | AuthError> => {
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

export const getFavoriteBookIds = async (): Promise<string[]> => {
    try {
        const response = await baseInstance.get<{ favorites: string[] }>('users/favorites');

        if (!response.data) {
            return [];
        }

        return response.data.favorites;
    } catch (error) {
        console.error(replaceBasicError(
            error,
            "Could not retrieve User favorites from the server."
        ));
        
        return [];
    }
}

export const updateFavoriteBookIds = async (ids: string[]): Promise<void> => {
    try {
        await baseInstance.post('users/favorites', { bookIds: ids }); 
    } catch (error) {
        console.error(replaceBasicError(
            error,
            "Could not update User's favorite book on the server."
        ));
    }
}

export const toggleServerFavorite = async (bookId: string): Promise<void> => {
    try {
        await baseInstance.put('users/favorites', { bookId: bookId });
    } catch (error) {
        console.error(replaceBasicError(
            error, 
            "Could not toggle User favorites on the server."
        ));
    }
}
