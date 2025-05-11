import baseInstance from "./baseInstance";
import { replaceBasicError } from "@/api/main";

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
