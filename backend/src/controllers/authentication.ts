import { Request, Response } from 'express';

import { AuthService } from '@app/services/AuthService';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: "User creditentials required." });
    }

    try {
        const newUser = await AuthService.register(username, email, password);
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(400).json({ message: "Error registering user:", error: error.message });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await AuthService.login(email, password);
        res.status(200).json({ message: "Logged in with email", user: user.email });
    } catch (error) {
        res.sendStatus(401);
    }
}
