import { StorageBook } from "@app/interfaces/Books";
import { UserInteraction } from "@app/interfaces/User";
import { Languages } from "@app/interfaces/Util";
import { getBooks } from "@app/models/book";
import { getUserInteractions, getUserWithFavoritesById } from "@app/models/user";
import { extractBookFromDoc } from "@app/utils";
import { InteractionService } from "./InteractionService";

export class RecommendService {
    private user: RecommendationUser;
    
    // preferedLanguages are handled for any user when in recommendation user only for authorized users.
    preferedLanuages: string[] = [Languages.English];

    scoreCalculator = new ScoreCalculator();

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
            score: this.scoreCalculator.calculateScore({
                rating: book.rating || 0
            })
        }))
        .sort((a, b) => b.score - a.score);

        return scoredBooks.slice(skip, skip + limit);
    }
}

class RecommendationUser {
    private id: string;
    private favorites: StorageBook[];
    private interactions: UserInteraction[];

    constructor(userID: string) {
        this.id = userID;
        this.retrieveFavorites();
        this.retrieveInteractions();
    }

    async retrieveFavorites(): Promise<StorageBook[]> {
        const user = await getUserWithFavoritesById(this.id);
        this.favorites = extractBookFromDoc(user.favorites);

        return this.favorites;
    }

    async retrieveInteractions(): Promise<UserInteraction[]> {
        const user = await getUserInteractions(this.id);
        const interactionManager = new InteractionService(this.id);
        this.interactions = interactionManager.mapInteraction(user.interactions);

        return this.interactions;
    }
}

class ScoreCalculator {
    /** 
     * Book properties weight matrix used to determine recommendation value of a book.
    */
    private weights: Object;

    /**
     * Recommendation Score based on weigted matrix.
     */
    private score: number;

    /** 
     * By default rating is the only priority.
    */
    constructor() {
        this.weights = {
            rating: 1,
            genre: 0,
            subject: 0,
            author: 0,
            recency: 0,
            language: 0,
            access: 0
        }
    }

    setWeights(newWeights: Partial<typeof this.weights>): void {
        this.weights = { ...this.weights, ...newWeights };
    }

    getWeights(): typeof this.weights {
        return this.weights;
    }

    /**
     * Calculate Recommendation Score based on weighted matrix.
     * @param values - values of StorageBook that are considered by recommendation.
     * @returns Recommendation Score based on weighted matrix.
     */
    calculateScore(values: Record<any, number>): number {
        this.score = Object.entries(this.weights).reduce((total, [key, weight]) => {
            return total + (values[key as keyof typeof this.weights] || 0) * weight;
        }, 0);

        return this.score;
    }
}
