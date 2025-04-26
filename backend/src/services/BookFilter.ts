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
import { Languages } from "@app/interfaces/Util";
import { setArrayWhitespace } from "@app/utils";
import { Logger } from "@app/utils/Logger";
import { BookMerger } from "@app/utils/BookMerger";

export class BookFilter {
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

        if (query.subjects.length === 0) {
            return result;
        }
        
        const requiredFilter = await this.hardQuery(query);
        const subjectFiltered = await this.subjectQuery(query.subjects);
        const filteredHard = BookMerger.findIntersection(requiredFilter, subjectFiltered);

        result.status = FilterStatus.Hard;
        result.books = filteredHard as ClientBook[];

        if (result.books.length >= requested) {
            return result;
        }

        const subjectAssociates = DataSerializer.formAssociations(query.subjects);
        const keywords = DataSerializer.getAssociationKeywords(subjectAssociates);

        const filteredByAssociations = await this.subjectQuery(keywords);
        const filteredExtended = BookMerger.findIntersection(requiredFilter, filteredByAssociations);

        result.status = FilterStatus.Soft;
        result.books = BookMerger.findUnion(result.books as StorageBook[], filteredExtended) as ClientBook[];

        if (result.books.length >= requested) {
            return result;
        }

        result.status = FilterStatus.Extend;
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
