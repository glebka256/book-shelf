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
    }
  }
});