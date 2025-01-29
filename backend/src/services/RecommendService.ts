import { StorageBook } from "@app/interfaces/Books";
import { UserInteraction } from "@app/interfaces/User";
import { Languages } from "@app/interfaces/Util";
import { getBooks } from "@app/models/book";
import { getUserInteractions, getUserWithFavoritesIds} from "@app/models/user";
import { extractBookFromDoc } from "@app/utils";
import { InteractionService } from "./InteractionService";

export class RecommendService {
    private user: RecommendationUser;
    
    // preferedLanguages are handled for any user while recommendation user data is only for authorized users.
    preferedLanuages: string[] = [Languages.English];

    updatePreferedLanguages(languages: Languages[]): void {
        this.preferedLanuages = languages;
    }

    setUser(userId: string) {
        this.user = new RecommendationUser(userId);
    }

    /**
     * Retrieves a list of popular books sorted by default for all users recommendation.
     * @param page - Current page number (1-indexed).
     * @param limit - Number of books per page.
     * @returns - Promise resolving to a list of StorageBook
     */
    async getPopularBooks(page: number, limit: number): Promise<StorageBook[]> {
        const skip = (page - 1) * limit;

        const books = await getBooks() as StorageBook[];

        const scoredBooks = extractBookFromDoc(books)
        .filter((book) => book.language.some(lang => this.preferedLanuages.includes(lang)))
        .map(book => ({
            ...book,
            score: book.rating
        }))
        .sort((a, b) => b.score - a.score);

        return scoredBooks.slice(skip, skip + limit);
    }
}

class RecommendationUser {
    private id: string;
    favoritesIds: string[];
    interactions: UserInteraction[];

    constructor(userID: string) {
        this.id = userID;
        this.retrieveFavorites();
        this.retrieveInteractions();
    }

    async retrieveFavorites(): Promise<string[]> {
        const user = await getUserWithFavoritesIds(this.id);
        this.favoritesIds = user.favorites.map((id) => id.toString());

        return this.favoritesIds;
    }

    async retrieveInteractions(): Promise<UserInteraction[]> {
        const user = await getUserInteractions(this.id);
        const interactionManager = new InteractionService(this.id);
        this.interactions = interactionManager.mapInteraction(user.interactions);

        return this.interactions;
    }
}
