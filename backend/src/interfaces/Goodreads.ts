export interface GoodreadsAuthor {
    id: string,
    name: string
};

export interface GoodreadsBook {
    bookId: string,
    title: string,
    workID: string,
    imageUrl: string,
    bookUrl: string,
    author: GoodreadsAuthor[],
    rank: number,
    rating: number,
    publishedYear: string
};

export interface GoodreadsBooksData {
    books: GoodreadsBook[],
    totalResults: number,
    currentPage: number,
}
