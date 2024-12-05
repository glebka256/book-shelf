import { merge } from "lodash";
import { 
    Request, 
    Response, 
    NextFunction
} from "express";

import { getUserBySessionToken } from "@app/models/user";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies.authToken;

        if (!sessionToken) {
            res.sendStatus(403);
            return;
        }
    
        const existingUser = await getUserBySessionToken(sessionToken);
    
        if (!existingUser) {
            res.sendStatus(403);
            return;
        }

        merge(req, { identity: existingUser });

        return next();
    } catch (error) {
        res.sendStatus(403);
        return;
    }
}
