import { defineStore } from "pinia";

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoriteBooksIds: [] as string[],
  }),

  getters: {
    isFavorite: (state) => (id: string) => state.favoriteBooksIds.includes(id),
    favoriteCount: (state) => state.favoriteBooksIds.length,
  },

  actions: {
    addFavorite(id: string) {
      if (!this.favoriteBooksIds.includes(id)) {
        this.favoriteBooksIds.push(id);
        this.addLocalFavorite(id);
      }
    },
    removeFavorite(id: string) {
      this.favoriteBooksIds.filter((itemId) => itemId !== id);
      this.removeLocalFavorite(id);
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
    }
  }
});
