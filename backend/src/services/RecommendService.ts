import { StorageBook } from "@app/interfaces/Books";
import { interactionTypes, UserInteraction } from "@app/interfaces/User";
import { Languages } from "@app/interfaces/Util";
import { getBookById, getBooks, queryBooks } from "@app/models/book";
import { getUserWithFavoritesIds} from "@app/models/user";
import { extractBookFromDoc, sliceMap, sortNumericRecord } from "@app/utils";
import { InteractionService } from "./InteractionService";
import { getBookGenre, retrieveGenres } from "@app/services/genreService";
import { loadBookRelationsSubject } from "./score/serialization";

export class RecommendService {
    private user: RecommendationUser;
    
    // preferedLanguages are handled for any user while recommendation user data is only for authorized users.
    preferedLanuages: string[] = [Languages.English];

    updatePreferedLanguages(languages: Languages[]): void {
        this.preferedLanuages = languages;
    }

    async setUser(userId: string) {
        this.user = new RecommendationUser(userId);
        await this.user.init();
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

    async formRecommendations(limit: number): Promise<StorageBook[]> {
        let recommedationIds = await this.getRecommendedIds();

        recommedationIds = sliceMap(recommedationIds, limit);
        const aggregatedIds = Array.from(recommedationIds.values()).flat();

        const books = await queryBooks({ _id: { $in: aggregatedIds } });
        return books as StorageBook[];
    }

    async getRecommendedIds(limit: number = 10): Promise<Map<string, string[]>> {
        const userInteractions = this.user.getAllInteractions();
        const recommedationIds = new Map<string, string[]>();
        const allGenres = retrieveGenres();

        for (const interaction of userInteractions) {
            const book = await getBookById(interaction.bookId);
            const genre = getBookGenre(book.subject, allGenres);
            const relatives = await loadBookRelationsSubject(genre, book.id);

            const sortedRelatedIds = Object.keys(sortNumericRecord(relatives));
            recommedationIds.set(book.id, sortedRelatedIds.slice(limit));
        }

        return recommedationIds;
    }
}

class RecommendationUser {
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
}
