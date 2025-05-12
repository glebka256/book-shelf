export interface User {
    username: string,
    email: string,
    authentication: {
        sessionToken: string
    }
}

export interface ValidationResult {
    userId: string | null,
    status: 200 | 401 | 404,
    message: string
}

export interface DecodedJWT {
    userId: string,
    username: string,
    iat: number,
    exp: number
}

export interface ClientInteraction {
    type: string,
    bookId: string,
    timestamp: string   // ISO 8601 String
}

export interface StorageInteraction {
    type: string,
    priority: number,
    bookId: string,
    timestamp: Date
}

export const interactionTypes = {
    // Like is only for click itself. Does not care if book is currently liked.
    like: {
        tag: 'like-clicked',
        priority: 3
    },
    read: {
        tag: 'read-clicked',
        priority: 2,
    },
    buy: {
        tag: 'buy-clicked',
        priority: 2,
    },

    // Registers if cover was clicked to open book details.
    cover: {
        tag: 'cover-clicked',
        priority: 1,    
    },

    // Same as Cover but when on the Search Page
    search: {
        tag: 'clicked-in-search',
        priority: 2,
    },
    favorite: {
        tag: 'selected-favorite',
        priority: 4
    }
} as const;

export type InteractionTypes = typeof interactionTypes;

export type InteractionEntry = typeof interactionTypes[keyof typeof interactionTypes];

export interface UserInteraction {
    type: InteractionEntry
    bookId: string,
    timestamp: Date
}
