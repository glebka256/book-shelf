export enum InteractionTypes {
    Like = 'like-clicked',   // Like is only for click itself. Does not care if book is currently liked.
    Read = 'read-clicked',
    Buy = 'buy-clicked',
    Cover = 'cover-clicked',        // Registers if cover was clicked to open book details.
    Searched = 'clicked-in-search'  // Same as Cover but when on the Search Page
}

export interface UserInteraction {
    type: InteractionTypes,
    bookId: string,
    timestamp: string   // ISO 8601 String
}
