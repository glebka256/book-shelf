import { ErrorRequestHandler } from "express";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";
import { Logger } from "@app/utils/Logger";

export const errorHandler: ErrorRequestHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if(err instanceof CustomError) {
        if(err.logging) {
            // Dont print error object because all error response is in message
            Logger.error(
                err.message, 
                err.namespace
            );
        }

        res.status(err.code).send({ message: err.message });
        return;
    }

    Logger.error("Internal server error:", "REQUEST", err.message);
    res.status(500).send({ message: "Internal server error" });
};