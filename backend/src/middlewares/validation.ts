import { Request, Response, NextFunction } from "express"
import { CustomError } from "@app/errors/CustomError";
import { bookFields } from "@app/interfaces/Sort";

export const validatePagination = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    const NAMESPACE = "PAGINATION-REQUEST";

    try {
        const page = parseInt(req.params.page);
        if (!page)
            return next(new CustomError(400, "Request missing page parameter", false, NAMESPACE));
        if (page <= 0) 
            return next(new CustomError(400, "Pagination is 1-indexed", false, NAMESPACE));
    
        const limit = parseInt(req.params.limit);
        if (!limit) return next(new CustomError(400, "Request missing limit parameter", false, NAMESPACE));
    
        next();
    } catch (error) {
        return next(error);
    } 
}

export const validateSortRequest = async (    
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    const NAMESPACE = "SORT-REQUEST";

    try {
        const sortBy = req.body.sortBy;
        if (!bookFields.includes(sortBy)) 
            throw new CustomError(400, "sortBy field must be one of: 'title', 'author', 'rating', 'publishedYear'", false, NAMESPACE);
    
        const orderDirection = req.body.order;
        if (orderDirection !== 'asc' && orderDirection !== 'desc')
            throw new CustomError(400, "'order' must be 'asc' or 'desc'", false, NAMESPACE);
    
        next();
    } catch (error) {
        return next(error);
    }
}