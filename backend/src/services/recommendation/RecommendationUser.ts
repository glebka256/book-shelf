import { InteractionService } from "./InteractionService";
import { getUserWithFavoritesIds} from "@app/models/user";
import { interactionTypes, UserInteraction } from "@app/interfaces/User";

export class RecommendationUser {
    private id: string;
    favoritesIds: string[];
    interactions: UserInteraction[];

    constructor(userID: string) {
        this.id = userID;
    }

    async init(): Promise<void> {
        await this.retrieveFavorites();
        await this.retrieveInteractions();
    }

    async retrieveFavorites(): Promise<string[]> {
        const user = await getUserWithFavoritesIds(this.id);
        this.favoritesIds = user.favorites.map((id) => id.toString());

        return this.favoritesIds;
    }

    async retrieveInteractions(): Promise<UserInteraction[]> {
        const interactionManager = new InteractionService(this.id);
        this.interactions = await interactionManager.load();

        return this.interactions;
    }

    getAllInteractions(): UserInteraction[] {
        let favoritesInteractions: UserInteraction[] = [];

        for (const favoriteId of this.favoritesIds) {
            favoritesInteractions.push({ 
                type: interactionTypes.favorite, 
                bookId: favoriteId,
                timestamp: new Date() // Date is set with latest in order to have highest time priority for items that are favorite now.
            });
        }

        return [...favoritesInteractions, ...this.interactions];
    }

    sortInteractions(interactions: UserInteraction[]): UserInteraction[] {
        return interactions.sort((a, b) => {
            if (b.type.priority !== a.type.priority) {
                return b.type.priority - a.type.priority;
            }
            // If priorities are the same, most recent to the top
            return b.timestamp.getTime() - a.timestamp.getTime();
        });
    }
}