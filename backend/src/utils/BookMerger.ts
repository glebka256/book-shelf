import { StorageBook } from "@app/interfaces/Books";

export class BookMerger {
    // Asumes array2 has unique items for efficient O(1) Set lookup time.
    static findIntersection(array1: StorageBook[], array2: StorageBook[]): StorageBook[] {
        const array2Ids = new Set(array2.map((book) => book.id));
        const filteredBooks = array1.filter((book) => array2Ids.has(book.id));

        return filteredBooks;
    }

    static findUnion(array1: StorageBook[], array2: StorageBook[]): StorageBook[] {
        const allBooks = [...array1, ...array2];
        const uniqueBooksMap = new Map<string, StorageBook>();

        allBooks.forEach((book) => {
            uniqueBooksMap.set(book.id, book);
        });

        return Array.from(uniqueBooksMap.values());
    }

    static findDifference(original: StorageBook[], comparison: StorageBook[]): StorageBook[] {
        const comparisonIds = new Set<string>(comparison.map((book) => book.id));
        const difference = original.filter((book) => !comparisonIds.has(book.id));

        return difference
    }

    static findUnique(array: StorageBook[]): StorageBook[] {
        const uniqueBooksMap = new Map<string, StorageBook>();

        array.forEach((book) => {
            uniqueBooksMap.set(book.title.toLowerCase(), book);
        })

        return Array.from(uniqueBooksMap.values());
    }
}
