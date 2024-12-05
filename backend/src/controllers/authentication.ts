import { Request, Response } from 'express';

import { AuthService } from '@app/services/AuthService';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: "User creditentials required." });
        return;
    }

    try {
        const newUser = await AuthService.register(username, email, password);
        res.status(201).json({ message: "User registered successfully." });
        return;
    } catch (error) {
        res.status(400).json({ message: "Error registering user:", error: error.message });
        return;
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }

    try {
        const user = await AuthService.login(email, password);

        res.cookie(
            process.env.COOKIE_HOST, 
            user.authentication.sessionToken, 
            { 
                domain: 'localhost', 
                path: '/',
                maxAge: 15 * 60 * 1000
            },
        );

        res.status(200).json({ message: "Logged in with email", user: user.email });
        return;
    } catch (error) {
        res.status(400).json({ message: "Could not login with provided credentials." });
        return;
    }
}

export const logout = (reg: Request, res: Response): void => {
    res.clearCookie(process.env.COOKIE_HOST);
    res.sendStatus(200);
    return;
}
