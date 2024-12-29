import { ClientBook, StorageBook } from "@app/interfaces/Books";
import { 
    FilterQuery, 
    HardQuery, 
    ArrayEntryQuery, 
    FilterResult, 
    FilterStatus, 
    FilterOptions,
} from "@app/interfaces/Filter";
import { queryBooks } from "@app/models/book";
import { DataSerializer } from "./DataSerializer";
import { SubjectAssociates } from "@app/interfaces/Data";
import { RecommendService } from "./RecommendService";
import { Languages } from "@app/interfaces/Util";

export class BookFilter {
    static suggestionSize = 50;

    static updateSuggestionSize(newSize: number) {
        this.suggestionSize = newSize;
    }

    static submitOptions(): FilterOptions {
        return {
            genre: DataSerializer.parseGenres(),
            language: Object.values(Languages),
            downloadable: 'true or false',
            readable: 'true or false'
        }
    }

    static async getBooks(query: FilterQuery, requested: number): Promise<FilterResult> {
        const requiredFilter = await this.hardQuery(query);
        const subjectFiltered = await this.subjectQuery(query.subjects);
        const filteredHard = this.filterIntersection(requiredFilter, subjectFiltered);

        if (filteredHard.length >= requested) {
            return { 
                status: FilterStatus.Hard, 
                books: filteredHard as ClientBook[]
            }
        }

        const subjectAssociates: SubjectAssociates[] = [];

        for (const subject of query.subjects) {
            subjectAssociates.push(DataSerializer.getAssociations(subject));
        }

        const keywords = subjectAssociates.map((associate) => (associate.subject.name));
        const extendedFilter = await this.subjectQuery(keywords);
        const filteredExtended = this.filterIntersection(requiredFilter, extendedFilter);

        if (filteredExtended.length >= requested) {
            return { 
                status: FilterStatus.Soft, 
                books: filteredExtended as ClientBook[]
            };
        }

        const recommendation = new RecommendService();

        const page = Math.floor(requested / this.suggestionSize); 
        const requestPage = page > 0 ? page : 1;
        const suggested = await recommendation.getPopularBooks(requestPage, this.suggestionSize);
        
        return { 
            status: FilterStatus.Extend, 
            books: suggested as ClientBook[]
        };
    }

    private static async hardQuery(query: FilterQuery): Promise<StorageBook[]> {
        const hardQuery: HardQuery = {};
        
        if (query.languages && query.languages.length > 0) {
            hardQuery['language'] = { $in: query.languages }
        }

        if (query.downloadable) {
            hardQuery['meta.idGutenberg'] = { $exists: true, $not: { $size: 0 } }
        }

        if (query.readable) {
            hardQuery['meta.idGoodreads'] = { $exists: true, $not: { $size: 0 } }
        }

        const documents = await queryBooks(hardQuery);
        return documents as StorageBook[];
    }

    private static async subjectQuery(keywords: string[]): Promise<StorageBook[]> {
        const queryCondition: ArrayEntryQuery = { $in: keywords };
        const relaxedQuery = { 'subject': queryCondition };

        const documents = await queryBooks(relaxedQuery);
        return documents as StorageBook[];
    }

    // Asumes array2 has unique items for efficient O(1) Set lookup time.
    private static filterIntersection(array1: StorageBook[], array2: StorageBook[]) {
        const array2Ids = new Set(array2.map((book) => book.id));
        const filteredBooks = array1.filter((book) => array2Ids.has(book.id));

        return filteredBooks;
    }
}
