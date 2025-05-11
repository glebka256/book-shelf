export const bookFields = ['title', 'author', 'rating', 'publishedYear'] as const;
export type SortableField = typeof bookFields[number];
export type SortOrder = 1 | -1;

export interface SortQuery {
    sortBy: SortableField,
    order: SortOrder,
    limit: number,
    page: number
}