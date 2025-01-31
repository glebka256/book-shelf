export interface ScoreBook {
    id: string,
    title: string,
    authors: string[],
    subjects: string[],
    year: number,
    rating: number
}

export interface ScoreBookChunk {
    genre: string,
    books: Set<ScoreBook>
}

export interface ScoreTable {
    [key: string]: {
        [key: string]: number
    }
}

export interface ScoreTableChunk {
    subject: string,
    chunk: string,
    data: ScoreTable
}