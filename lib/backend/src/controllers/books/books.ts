import { Request, Response } from "express";
import { createControllerHandler } from "../controllerHandler";
import { CustomError } from "@app/errors/CustomError";
import { get } from 'lodash';
import { ClientBook, SearchParams, StorageBook } from "@app/interfaces/Books";
import { FilterQuery, FilterStatus } from "@app/interfaces/Filter";
import { Languages } from "@app/interfaces/Util";
import { RecommendService } from "@app/services/recommendation/RecommendService";
import { BookFilter } from "@app/services/BookFilter";
import { searchByQuery, searchDownloadable } from "@app/services/BookSearch";
import bookManager from "@app/config/book-manager";

const NAMESPACE = "BOOKS-REQUEST";
const controllerHandler = createControllerHandler(NAMESPACE);

export const getGeneralPopular = controllerHandler(async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const limit = req.params.limit ? parseInt(req.params.limit) : 50;

    const defaultRecommend = new RecommendService(); 
    const popularBooks = await defaultRecommend.getPopularBooks(page, limit);
    res.status(200).json(popularBooks);
});

export const getFilterOptions = controllerHandler(async (req, res) => {
    const filters = BookFilter.submitOptions();
    if (!filters) 
        throw new CustomError(500, "Could not retrieve any filtering options", false, NAMESPACE);
    
    res.status(200).json(filters);
});

export const getFiltered = controllerHandler(async (req, res) => {
    // TODO: move all logic to service layer
    const query = req.body.query as FilterQuery;
    if (!query) 
        throw new CustomError(400, "Request missing 'query' field from request body", false, NAMESPACE);

    const endPage = parseInt(req.body.page) || -1;
    if (endPage === -1) 
        throw new CustomError(400, "Request missing 'page' field from request body", false, NAMESPACE);

    const beginPage = endPage - 1;
    const pageSize = 25;

    const filtered = await BookFilter.getBooks(query, pageSize * endPage);
    // Results with all required params are good to return
    if (filtered.status === FilterStatus.Hard || filtered.status === FilterStatus.Soft) {
        filtered.books = filtered.books.slice(beginPage * pageSize, endPage * pageSize);
        
        res.status(200).json(filtered)
        return;
    }
    
    // Need to populate with more relaxed filtering
    const recommendation = new RecommendService();

    // Still need hard filter on languages only
    if (query.languages.length > 0) {
        recommendation.updatePreferedLanguages(query.languages as Languages[]);
    }

    // After all fiters are exhausted, feed books from general recommendations
    const retrieved = filtered.books.length;
    const recommendationLimit = pageSize - retrieved;
    const popularBooks = await recommendation.getPopularBooks(endPage, recommendationLimit);

    filtered.books = filtered.books.slice(beginPage * pageSize, endPage * pageSize);
    filtered.books = filtered.books.concat(popularBooks as ClientBook[]);
    filtered.status = FilterStatus.Extend;

    res.status(200).json(filtered)
});

export const lookupBookDetails = controllerHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) 
        throw new CustomError(400, "Request missing id parameter", false, NAMESPACE);

    const book: ClientBook = await bookManager.lookupBook(id);
    if (!book) 
        throw new CustomError(404, "Book not found", false, NAMESPACE);
    
    res.status(200).json(book);
});

const mapParams = (params: any): SearchParams | null => {
    if (!params.query || isNaN(params.page)) {
        return null;
    }
    
    return {
        query: params.query,
        page: Number(params.page),
        pageSize: 50
    }
}

const calculateSkip = (params: SearchParams): number => {
    return (params.page - 1) * params.pageSize;
}

/**
 * Search status is used to inform server if all results have been fetched.
 * By checking status client can prevent making unnecessary repetative requests.
 */
const calculateSearchStatus = (resultLength: number, params: SearchParams): boolean => {
    return resultLength < params.page * params.pageSize ? true : false;
}

/**
 * Handles the search operation for books.
 * @param req - The request object.
 * @param res - The response object.
 * @param searchFn - The search function to be used (e.g., searchByQuery, searchDownloadable).
 */
const handleSearch = async (
    req: Request,
    res: Response,
    searchFn: (query: string, skip: number, pageSize: number) => Promise<StorageBook[]>
) => {
    const params = mapParams(req.params);

    if (params === null) {
        res.status(400).json({ message: "Search query and page number are required." });
        return;
    }

    const books = await searchFn(params.query, calculateSkip(params), params.pageSize);
    const searchStatus = calculateSearchStatus(books.length, params);

    if (!books) {
        res.status(400).json({ message: `Could not search book by query: ${params.query}` });
    } else {
        res.status(200).json({ searchComplete: searchStatus, books: books });
    }
}

export const searchBook = controllerHandler(async (req, res) => {
    return handleSearch(req, res, searchByQuery);
});

export const searchDownloadableBook = controllerHandler(async (req, res) => {
    return handleSearch(req, res, searchDownloadable);
});

export const getRecommendations = controllerHandler(async (req, res) => {
    // TODO: lookup why pageSize is hardcoded
    const endPage = parseInt(req.params.page) || 1;
    const beginPage = endPage - 1;
    const pageSize = 50;
    const limit = endPage * pageSize;

    const userId = get(req, 'identity._id') as string;
    if (!userId) 
        throw new CustomError(400, "Request missing user identity", false, NAMESPACE);
    
    const recommendation = new RecommendService();
    await recommendation.setUser(userId);

    let recommendedBooks = await recommendation.formRecommendations(limit);
    recommendedBooks = recommendedBooks.slice(beginPage * pageSize, endPage * pageSize);

    res.status(200).json(recommendedBooks);
});