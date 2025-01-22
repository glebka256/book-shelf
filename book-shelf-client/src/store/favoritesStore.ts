import { defineStore } from "pinia";
import { getLoginStatus, toggleServerFavorite } from "@/api/user";
import {
  addLocalFavorite, 
  getLocalFavorites, 
  removeLocalFavorite, 
  syncFavorites
} from "@/services/favoritesService";

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
      this.favoriteBooksIds.push(id);
      addLocalFavorite(id);
      
      if (await getLoginStatus()) {
        await toggleServerFavorite(id);
      }
    },

    async removeFavorite(id: string) {
      this.favoriteBooksIds = this.favoriteBooksIds.filter((itemId) => itemId !== id);
      removeLocalFavorite(id);

      if (await getLoginStatus()) {
        await toggleServerFavorite(id);
      }
    },

    async toggleFavorite(id: string) {
      if (this.isFavorite(id)) {
        await this.removeFavorite(id);
      } else {
        await this.addFavorite(id);
      }
    },

    async initialize() {
      this.favoriteBooksIds = getLocalFavorites();

      if (await getLoginStatus()) {
        await syncFavorites();
      }
    },
  }
});
