import { createControllerHandler } from './controllerHandler';
import { CustomError } from '@app/errors/CustomError';
import { AuthService } from '@app/services/AuthService';
import { getUserById } from '@app/models/user';
import { User } from '@app/interfaces/User';

const NAMESPACE = "AUTH-REQUEST";
const controllerHandler = createControllerHandler(NAMESPACE);

export const register = controllerHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        throw new CustomError(400, "Request body missing user credentials (username, email, password)", false, NAMESPACE);

    const newUser = await AuthService.register(username, email, password);
    res.status(201).json({ message: "User registered successfully." });
});

export const login = controllerHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        throw new CustomError(400, "Request body missing user credentials (username, email)", false, NAMESPACE);

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
});

export const logout = controllerHandler(async (req, res) => {
    res.clearCookie(process.env.COOKIE_HOST);
    res.sendStatus(200);
});

export const getUserInfo = controllerHandler(async (req, res) => {
    const token = req.cookies[process.env.COOKIE_HOST];

    if (!token)
        throw new CustomError(401, "Unauthorized", false, NAMESPACE);

    const decoded = await AuthService.verifyAuthToken(token);

    if (decoded === null)
        throw new CustomError(401, "Unauthorized", false, NAMESPACE);

    const user = await getUserById(decoded.userId) as User;
        if (!user) 
            throw new CustomError(404, "User not found", false, NAMESPACE);
    
    res.status(200).json({ username: user.username, email: user.email });
});