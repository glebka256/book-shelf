import { StorageBook } from "@app/interfaces/Books";
import { Languages } from "@app/interfaces/Util";
import { getBooks } from "@app/models/book";

export class RecommendService {
    /**
     * Retrieves a list of popular books sorted by default for all users recommendation.
     * @param page - Current page number (1-indexed).
     * @param limit - Number of books per page.
     * @returns - Promise resolving to a list of StorageBook
     */
    async getPopularBooks(page: number, limit: number): Promise<StorageBook[]> {
        const skip = (page - 1) * limit;

        const books = await getBooks() as StorageBook[];

        const scoreCalculator = new ScoreCalculator;

        const scoredBooks = books
        .filter((book) => book.language.includes(Languages.English))
        .map(book => ({
            ...book,
            score: scoreCalculator.calculateScore({
                rating: book.rating || 0
            })
        }))
        .sort((a, b) => b.score - a.score);

        return scoredBooks.slice(skip, skip + limit);
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
