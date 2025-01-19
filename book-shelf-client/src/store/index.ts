import { defineStore } from "pinia";
import baseInstance, { getLoginStatus } from "@/api/baseInstance";
import { Book } from '@/types/Book';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoriteBooksIds: [] as string[],
  }),

  getters: {
    isFavorite: (state) => (id: string) => state.favoriteBooksIds.includes(id),
    favoriteCount: (state) => state.favoriteBooksIds.length,
  },

  actions: {
    async fetchFavorites() {
      try {
        if (await getLoginStatus()) {
          const response = await baseInstance.get('/users/favorites');
          const favoriteBooks = response.data as Book[];
          this.favoriteBooksIds = favoriteBooks.map((favoriteBook) => favoriteBook._id);
        } else {
          this.favoriteBooksIds = this.getLocalFavorites();
        }
      } catch (error) {
        console.error("Could not retrieve user's favorite books.");
      }
    },
    addFavorite(id: string) {
      if (!this.favoriteBooksIds.includes(id)) {
        this.favoriteBooksIds.push(id);
      }
    },
    removeFavorite(id: string) {
      this.favoriteBooksIds.filter((itemId) => itemId !== id);
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
    addLocalFavorite(id: string) {
      const localFavorites = this.getLocalFavorites()
        .filter((itemId: string) => itemId !== id);
      localStorage.setItem('favorites', JSON.stringify(localFavorites));
    },
    clearLocalFavorites() {
      localStorage.removeItem('favorites');
    }
  }
});