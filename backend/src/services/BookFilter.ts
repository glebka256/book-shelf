import { ClientBook, StorageBook } from "@app/interfaces/Books";
import { 
    FilterQuery, 
    HardQuery, 
    FilterResult, 
    FilterStatus, 
    FilterOptions,
} from "@app/interfaces/Filter";
import { queryBooks } from "@app/models/book";
import { DataSerializer } from "./DataSerializer";
import { RecommendService } from "./RecommendService";
import { Languages } from "@app/interfaces/Util";
import { setArrayWhitespace } from "@app/utils";
import { Logger } from "@app/utils/Logger";
import { BookMerger } from "@app/utils/BookMerger";

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
        const result: FilterResult = {
            status: FilterStatus.Empty,
            books: []
        }
        
        const requiredFilter = await this.hardQuery(query);
        const subjectFiltered = await this.subjectQuery(query.subjects);
        const filteredHard = BookMerger.findIntersection(requiredFilter, subjectFiltered);

        result.status = FilterStatus.Hard;
        result.books = filteredHard as ClientBook[];

        Logger.log('Filtering...');
        Logger.log('Filtered hard: ', filteredHard.length);
        Logger.log('Filtered total: ', result.books.length);

        if (result.books.length >= requested) {
            return result;
        }

        const subjectAssociates = DataSerializer.formAssociations(query.subjects);
        const keywords = DataSerializer.getAssociationKeywords(subjectAssociates);

        const filteredByAssociations = await this.subjectQuery(keywords);
        const filteredExtended = BookMerger.findIntersection(requiredFilter, filteredByAssociations);

        result.status = FilterStatus.Soft;
        result.books = [...result.books, ...filteredExtended as ClientBook[]];

        Logger.log('Filtered extended: ', filteredExtended.length);
        Logger.log('Filtered total: ', result.books.length);

        if (result.books.length >= requested) {
            return result;
        }

        const recommendation = new RecommendService();

        const page = Math.floor(requested / this.suggestionSize); 
        const requestPage = page > 0 ? page : 1;
        const suggested = await recommendation.getPopularBooks(requestPage, requested - result.books.length);
        
        result.status = FilterStatus.Extend;
        result.books = [...result.books, ...suggested as ClientBook[]];

        Logger.log('Filtered extended: ', suggested.length);
        Logger.log('Filtered total: ', result.books.length);

        return result;
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
        const results = new Set<StorageBook>();
        
        const strictResults = await queryBooks({ 'subject': { $in: keywords }});
        strictResults.forEach(result => results.add(result as StorageBook));

        const formattedKeywords = setArrayWhitespace(keywords, 'whitespace');
        const relaxedQuery = { 'subject': { $in: formattedKeywords } };
        const relaxedResults = await queryBooks(relaxedQuery);
        relaxedResults.forEach(result => results.add(result as StorageBook));

        return Array.from(results);
    }
}
