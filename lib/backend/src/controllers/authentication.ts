import { createControllerHandler } from './controllerHandler';
import { CustomError } from '@app/errors/CustomError';
import { AuthService } from '@app/services/AuthService';
import { getUserById, deleteUserById } from '@app/models/user';
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
            domain: process.env.AUTH_DOMAIN || 'localhost', 
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

export const getUserId = controllerHandler(async (req, res) => {
    const token = req.cookies[process.env.COOKIE_HOST];
    
    const validationResult = await AuthService.validateUser(token);

    if (validationResult.userId === null)
        throw new CustomError(validationResult.status, validationResult.message, false, NAMESPACE);
    
    res.status(200).json({ userId: validationResult.userId });
});

export const getUserInfo = controllerHandler(async (req, res) => {
    const token = req.cookies[process.env.COOKIE_HOST];

    const validationResult = await AuthService.validateUser(token);

    if (validationResult.userId === null)
        throw new CustomError(validationResult.status, validationResult.message, false, NAMESPACE);

    const user = await getUserById(validationResult.userId) as User;
    
    res.status(200).json({ username: user.username, email: user.email });
});

export const deleteUser = controllerHandler(async (req, res) => {
    const token = req.cookies[process.env.COOKIE_HOST];

    const validationResult = await AuthService.validateUser(token);
    const userId = validationResult.userId;

    if (userId === null)
        throw new CustomError(validationResult.status, validationResult.message, false, NAMESPACE);

    const deletedUser = await deleteUserById(userId);
    if (!deletedUser) 
        throw new CustomError(404, "User not found", false, NAMESPACE);

    res.status(201).json({ message: "Deleted user with id: " + userId });
});