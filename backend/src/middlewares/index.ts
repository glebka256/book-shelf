import { merge, get } from "lodash";
import { 
    Request, 
    Response, 
    NextFunction
} from "express";

import { getUserBySessionToken } from "@app/models/user";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sessionToken = req.cookies[process.env.COOKIE_HOST];

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

        next();
        return;
    } catch (error) {
        res.sendStatus(403);
        return;
    }
}

export const isAccountOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (currentUserId.toString() !== id) {
            res.status(403).json({ message: "Must be owner to execute action." });
            return;
        }

        next();
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(403);
        return;
    }
}
