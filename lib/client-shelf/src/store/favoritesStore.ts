import { defineStore } from "pinia";
import { toggleServerFavorite } from "@/api/user";
import * as favoritesService from "@/services/favoritesService";
import auth from '@/config/auth';

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
      favoritesService.addLocalFavorite(id);
      
      if (await auth.api.getLoginStatus()) {
        await toggleServerFavorite(id);
      }
    },

    async removeFavorite(id: string) {
      this.favoriteBooksIds = this.favoriteBooksIds.filter((itemId) => itemId !== id);
      favoritesService.removeLocalFavorite(id);

      if (await auth.api.getLoginStatus()) {
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
      this.favoriteBooksIds = favoritesService.getLocalFavorites();

      if (await auth.api.getLoginStatus()) {
        await favoritesService.syncFavorites();
      }
    },
  }
});