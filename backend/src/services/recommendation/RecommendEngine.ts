import * as genreService from '@app/services/recommendation/genreService';
import { getBooks, getBookById } from '@app/models/book';
import { loadBookRelationsSubject } from '../score/serialization';
import { extractBookFromDoc, shuffleArray, sortNumericRecord } from '@app/utils';
import { UserInteraction } from '@app/interfaces/User';
import { StorageBook } from '@app/interfaces/Books';

export class RecommendEngine {
    async getPopularBooks(): Promise<StorageBook[]> {
        const books = extractBookFromDoc(await getBooks());
        return this.getCategoryMixedBooks(books);
    }

    // TODO: remove some occasional repetition
    async getCategoryMixedBooks(initial: StorageBook[]): Promise<StorageBook[]> {
        const books = [...initial];

        // Categorize by rating
        const categorizedBooks: {[key: string]: StorageBook[]} = {
            top: [],
            mid: [],
            bottom: []
        }

        const categoryBounds = {
            top: 4.0,
            mid: 3.0,
            bottom: 0
        }

        books.forEach(book => {
            const score = book.rating;
            if (score >= categoryBounds.top) { 
                categorizedBooks.top.push({ ...book });
            } else if (score >= categoryBounds.mid) {
                categorizedBooks.mid.push({ ...book });
            } else {
                categorizedBooks.bottom.push({ ...book });
            }
        });

        // Shuffle each category
        Object.keys(categorizedBooks).forEach(key => {
            categorizedBooks[key] = this.shuffleArray(categorizedBooks[key]);
        });

        // Build result with mixed categories
        const result: StorageBook[] = [];
        const maxBooks = books.length;

        // Weights represent probability to pick of selecting book from category
        const weights = {
            top: 0.7,
            mid: 0.2,
            bottom: 0.1
        }

        // Probabalistic selection algorithm
        while ( result.length < maxBooks) {
            const rand = Math.random();
            // Start from highest priority category
            let category = 'top';
            let weightCumulation = 0;

            for (const [cat, weight] of Object.entries(weights)) {
                weightCumulation += weight;
                if (rand < weightCumulation) {
                    category = cat;
                    break;
                }
            }

            if (categorizedBooks[category].length > 0) {
                result.push(categorizedBooks[category].shift()!);
            } else {
                // Category exhausted, redistribute probabilities
                weights[category as keyof typeof weights] = 0;
                const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
                for (const cat of Object.keys(weights) as Array<keyof typeof weights>) {
                    if (weights[cat] > 0) {
                        weights[cat] = weights[cat] / total;
                    }
                }
            }
        }

        return result;
    }

    async getRecommendedIds(
        userInteractions: UserInteraction[], 
        perBookLimit: number = 10
    ): Promise<Map<string, string[]>> {
        const recommedationIds = new Map<string, string[]>();
        const allGenres = genreService.retrieveGenres();

        for (const interaction of userInteractions) {
            const book = await getBookById(interaction.bookId);
            const genre = genreService.getBookGenre(book.subject, allGenres);
            const relatives = await loadBookRelationsSubject(genre, book.id);

            const sortedRelatedIds = Object.keys(sortNumericRecord(relatives));
            recommedationIds.set(book.id, sortedRelatedIds.slice(perBookLimit));
        }

        return recommedationIds;
    }

    // Copied from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffleArray <T>(array: T[]): T[] {
        // Return value not reference, dont modify original array
        const arr = [...array];
    
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    
        return arr;
    }
}