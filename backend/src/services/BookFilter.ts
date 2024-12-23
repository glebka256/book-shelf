import { StorageBook } from "@app/interfaces/Books";
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
            return { status: FilterStatus.Hard, books: filteredHard }
        }

        const subjectAssociates: SubjectAssociates[] = [];

        for (const subject of query.subjects) {
            subjectAssociates.push(DataSerializer.getAssociations(subject));
        }

        const keywords = subjectAssociates.map((associate) => (associate.subject.name));
        const extendedFilter = await this.subjectQuery(keywords);
        const filteredExtended = this.filterIntersection(requiredFilter, extendedFilter);

        if (filteredExtended.length >= requested) {
            return { status: FilterStatus.Soft, books: filteredExtended };
        }

        const recommendation = new RecommendService();

        const page = Math.floor(50 / requested); 
        const requestPage = page > 0 ? page : 1;
        const suggested = await recommendation.getPopularBooks(requestPage, requested);
        
        return { status: FilterStatus.Extend, books: suggested };
    }

    private static async hardQuery(query: FilterQuery): Promise<StorageBook[]> {
        const hardQuery: HardQuery = {
            language: { $in: query.languages },
            link: {
                downloadUrl: { $exists: true, $ne: '' },
                readUrl: { $exists: true, $ne: '' }
            }
        }

        const documents = await queryBooks(hardQuery);
        return documents as StorageBook[];
    }

    private static async subjectQuery(keywords: string[]): Promise<StorageBook[]> {
        const relaxedQuery: ArrayEntryQuery = { $in: keywords};

        const documents = await queryBooks(relaxedQuery);
        return documents as StorageBook[];
    }

    private static filterIntersection(array1: StorageBook[], array2: StorageBook[]) {
        const filterSet = new Set(array2);
        return array1.filter((item) => filterSet.has(item));
    }
}
