import { defineStore } from 'pinia';
import { InteractionTypes, UserInteraction } from '@/types/User';

export const useInteractionStore = defineStore('interaction', {
    state: () => ({
        interactions: [] as UserInteraction[],
    }),

    getters: {
        interactionCount: (state) => state.interactions.length,
    },

    actions: {
        saveInteraction(type: InteractionTypes, bookId: string) {
            this.interactions.push({
                type: type,
                bookId: bookId,
                timestamp: new Date().toISOString(),
            });

            console.log("Saved interaction: ", {
                type: type,
                bookId: bookId,
                timestamp: new Date().toISOString(),
            });
        },
        clearInteractions() {
            this.interactions = [];
        }
    }
});
