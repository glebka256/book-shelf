import { getFavoriteBookIds, updateFavoriteBookIds } from "@/api/user"
import { mergeArrays } from "@/utils";

export const getLocalFavorites = (): string[] => {
    const localData = localStorage.getItem('favorites');
    return localData ? JSON.parse(localData): [];
}

export const addLocalFavorite = (id: string) => {
    const localFavorites = getLocalFavorites();
    localFavorites.push(id);
    localStorage.setItem('favorites', JSON.stringify(localFavorites));
}

export const removeLocalFavorite = (id: string) => {
    const localFavorites = getLocalFavorites()
        .filter((itemId: string) => itemId !== id);
    localStorage.setItem('favorites', JSON.stringify(localFavorites));
}

export const toggleLocalFavorite = (id: string) => {
    const localFavorites = getLocalFavorites();

    if (localFavorites.includes(id)) {
        removeLocalFavorite(id);
    } else {
        addLocalFavorite(id);
    }
}

export const clearLocalFavorites = () => {
    localStorage.removeItem('favorites');
}

export const overwriteLocalFavorites = (favoritesIds: string[]) => {
    localStorage.setItem('favorites', JSON.stringify(favoritesIds));
}

export const syncFavorites = async () => {
    try {
        const serverFavoritesIds: string[] = await getFavoriteBookIds();
        const localFavoritesIds:  string[] = getLocalFavorites();

        const mergedIds = mergeArrays(serverFavoritesIds, localFavoritesIds);
        overwriteLocalFavorites(mergedIds);
        updateFavoriteBookIds(mergedIds);
    } catch (error) {
        console.error("Could not sync favorite books in storage with the server. Error: ", error);
    }
}
