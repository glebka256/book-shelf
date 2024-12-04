import { AuthService } from '../../src/services/AuthService';

/// Hashing and tokenization tests
test('hashPassword should hash passwords', async () => {
    const password = 'mySecurePassword';
    const hashed = await AuthService.hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(await AuthService.comparePasswords(password, hashed)).toBe(true);
});

test('generateAuthToken and verifyAuthToken should work', () => {
    const token = AuthService.generateAuthToken('123', 'testUser');
    expect(typeof token).toBe('string');
    expect(AuthService.verifyAuthToken(token));
});

test('verifyAuthToken should return false for invalid tokens', () => {
    expect(() => AuthService.verifyAuthToken('invalidToken')).toThrow('Invalid token');
});

/// Authentication tests
import { 
    UserModel, 
    getUserByEmail, 
    updateUserById 
} from '../../src/models/user';

jest.mock('../../src/models/user');
const saveMock = jest.fn();
UserModel.prototype.save = saveMock;

test('register should save a new user', async () => {
    await AuthService.register('testUser', 'test@example.com', 'password123');
    expect(saveMock).toHaveBeenCalled();
});

jest.mock('../../src/models/user', () => ({
    getUserByEmail: jest.fn(),
    updateUserById: jest.fn(),
}));

test('login should authenticate a user and update session token', async () => {
    const mockUser = {
        id: '123',
        username: 'testUser',
        authentication: {
            password: await AuthService.hashPassword('password123'),
            sessionToken: '',
        },
    };

    (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    await AuthService.login('test@example.com', 'password123');

    expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(updateUserById).toHaveBeenCalledWith('123', expect.any(Object));
});


