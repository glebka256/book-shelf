import { RecommendationUser } from "./RecommendationUser";
import { RecommendEngine } from "./RecommendEngine";
import { getBooksByIds } from "@app/models/book";
import { sliceMap } from "@app/utils";
import { StorageBook } from "@app/interfaces/Books";
import { Languages } from "@app/interfaces/Util";

export class RecommendService {
    private user: RecommendationUser;
    private engine: RecommendEngine;
    
    // preferedLanguages are handled for unauthorized users as well
    preferedLanuages: string[];

    constructor() {
        this.engine = new RecommendEngine();
        this.preferedLanuages = [Languages.English];
    }

    updatePreferedLanguages(languages: Languages[]): void {
        this.preferedLanuages = languages;
    }

    async setUser(userId: string) {
        this.user = new RecommendationUser(userId);
        await this.user.init();
    }

    /**
     * Retrieves a list of popular books sorted by default for any user
     * @param page - Current page number (1-indexed)
     * @param limit - Number of books per page
     * @returns - Most popular books sorted by book.rating
     */
    async getPopularBooks(page: number, limit: number): Promise<StorageBook[]> {
        const skip = (page - 1) * limit;

        const books = await this.engine.getPopularBooks();
        const filteredBooks = books
            .filter((book) => book.language.some(lang => this.preferedLanuages.includes(lang)))

        return filteredBooks.slice(skip, skip + limit);
    }

    async formRecommendations(limit: number): Promise<StorageBook[]> {
        let userInteractions = this.user.getAllInteractions();
        userInteractions = this.user.sortInteractions(userInteractions);

        let recommedationIds = await this.engine.getRecommendedIds(userInteractions);
        recommedationIds = sliceMap(recommedationIds, limit);

        const aggregatedIds = Array.from(recommedationIds.values()).flat();
        return (await getBooksByIds(aggregatedIds)) as StorageBook[];
    }
}
