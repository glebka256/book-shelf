import { CustomError } from '@app/errors/CustomError';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@app/utils/Logger';

type ControllerHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const createControllerHandler = (namespace: string) => {
    return (fn: ControllerHandler) => 
    (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((error) => {
            if (error instanceof CustomError) {
                next(error);
            } else {
                next(new CustomError(500, error.message || "Internal server error", true, namespace));
            }
        });
    }
}