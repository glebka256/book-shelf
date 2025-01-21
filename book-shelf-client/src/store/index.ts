import baseInstance, { getLoginStatus } from "@/api/baseInstance";
import { defineStore } from "pinia";
import { mergeArrays } from '@/utils';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoriteBooksIds: [] as string[],
  }),

  getters: {
    isFavorite: (state) => (id: string) => state.favoriteBooksIds.includes(id),
    favoriteCount: (state) => state.favoriteBooksIds.length,
  },

  actions: {
    async addFavorite(id: string) {
      if (!this.favoriteBooksIds.includes(id)) {
        this.favoriteBooksIds.push(id);
        this.addLocalFavorite(id);
        
        if (await getLoginStatus()) {
          await this.toggleServerFavorite(id);
        }
      }
    },

    async removeFavorite(id: string) {
      this.favoriteBooksIds = this.favoriteBooksIds.filter((itemId) => itemId !== id);
      this.removeLocalFavorite(id);

      if (await getLoginStatus()) {
        await this.toggleServerFavorite(id);
      }
    },

    toggleFavorite(id: string) {
      if (this.isFavorite(id)) {
        this.removeFavorite(id);
      } else {
        this.addFavorite(id);
      }
    },

    getLocalFavorites() {
      const localData = localStorage.getItem('favorites');
      return localData ? JSON.parse(localData): [];
    },

    toggleLocalFavorite(id: string) {
      const localFavorites = this.getLocalFavorites();
      if (localFavorites.includes(id)) {
        this.removeLocalFavorite(id);
      } else {
        this.addLocalFavorite(id);
      }
    },

    addLocalFavorite(id: string) {
      const localFavorites = this.getLocalFavorites();
      localFavorites.push(id);
      localStorage.setItem('favorites', JSON.stringify(localFavorites));
    },

    removeLocalFavorite(id: string) {
      const localFavorites = this.getLocalFavorites()
        .filter((itemId: string) => itemId !== id);
      localStorage.setItem('favorites', JSON.stringify(localFavorites));
    },

    clearLocalFavorites() {
      localStorage.removeItem('favorites');
    },

    overwriteLocalFavorites(favoritesIds: string[]) {
      localStorage.setItem('favorites', JSON.stringify(favoritesIds));
    },

    async fetchFavoriteBookIds(): Promise<string[]> {
      try {
        const response = await baseInstance.get<{ favorites: string[] }>('users/favorites');
    
        if (!response.data) {
          return [];
        }
    
        return response.data.favorites;
      } catch (error) {
        console.error("Could not get User's favorite books from server.");
        return [];
      }
    },
    
    async toggleServerFavorite(id: string) {
      try {
        await baseInstance.put('users/favorites', { bookId: id });
      } catch (error) {
        console.error("Could not toggle User favorites on the server.");
      }
    },

    async updateFavoriteBookIds(ids: string[]): Promise<void> {
      try {
        await baseInstance.post('users/favorites', { bookIds: ids }); 
      } catch (error) {
        console.error("Could not update User's favorite book on the server.");
      }
    },

    async syncFavorites() {
      try {
        const serverFavoritesIds: string[] = await this.fetchFavoriteBookIds();
        const localFavoritesIds: string[] = this.getLocalFavorites();
    
        const mergedIds = mergeArrays(serverFavoritesIds, localFavoritesIds);
        this.overwriteLocalFavorites(mergedIds);
        this.updateFavoriteBookIds(mergedIds);
      } catch (error) {
        console.error("Could not sync favorite books selection with the server.", error);
      }
    }
  }
});
