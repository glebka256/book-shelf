import { Logger } from '@app/utils/Logger';
import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

dotenv.config({
    path: [
        '.env.local',
        `.env.${process.env.NODE_ENV || 'dev'}`,
        '.env'
    ]
});

const configSchema = z.object({
    // App global
    NODE_ENV: z.enum(['dev', 'stage', 'prod']).default('dev'),
    APP_NAME: z.string(),
    PORT: z.coerce.number(),
    HOST: z.string().url(),

    // DB
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),

    // AUTH
    JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters long"),
    AUTH_DOMAIN: z.string().min(1, "AUTH_DOMAIN is required"),
    COOKIE_HOST: z.string().min(1, "COOKIE_HOST is required"),

    // API config
    API_BASE_URL: z.string().url(),
    ALLOWED_ORIGINS: z.preprocess((val) => {
        if (typeof val === 'string') {
            return val.split(',').map(s => s.trim());
        }
        return val;
    }, z.array(z.string().url())),

    API_HOST_KEY: z.string(),
    API_HOST_NAME: z.string(),
    
    GOODREADS_BASE_URL: z.string().url(),
    GOODREADS_API_KEY: z.string().min(1, "GOODREADS_API_KEY is required"),
    GOODREADS_API_HOST: z.string().min(1, "GOODREADS_API_HOST is required"),

    ANNAS_ARCHIVE_BASE_URL: z.string().url(),
    ANNAS_ARCHIVE_API_KEY: z.string().min(1, "ANNAS_ARCHIVE_API_KEY is required"),
    ANNAS_ARCHIVE_API_HOST: z.string().min(1, "ANNAS_ARCHIVE_API_HOST is required"),

    BBOOKS_API_BASE_URL: z.string().url().optional(),
    BBOOKS_API_KEY: z.string().optional(),
    BBOOKS_API_HOST: z.string().optional(),

    OPEN_LIBRARY_BASE_URL: z.string().url(),
    OPEN_LIBRARY_USER_AGENT: z.string().min(1, "OPEN_LIBRARY_USER_AGENT is required"),
    GUTENBERG_API_BASE_URL: z.string().url(),
    
    // Paths
    CLIENT_SHELF_DIST_PATH: z.string().default('../../client-shelf/dist'),
    ADMIN_SHELF_DIST_PATH: z.string().default('../../admin-shelf/dist'),
    SCORE_DATA_DIRPATH: z.string().default('D:\\STD\\repos\\book-shelf\\backend\\src\\data\\realtion'),
});

const parseConfig = () => {
    try {
        return configSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err =>
                `${err.path.join('.')}: ${err.message}`
            ).join('\n');

            Logger.error('Environment configuration failed on validation:\n' + errorMessages);
            process.exit(1);
        }
        throw error;
    }
};

const rawConfig = parseConfig();

export const config = {
    env: rawConfig.NODE_ENV,
    appName: rawConfig.APP_NAME,
    isDev: rawConfig.NODE_ENV === 'dev',
    isProd: rawConfig.NODE_ENV === 'prod',

    server: {
        port: rawConfig.PORT,
        host: rawConfig.HOST,
        allowedOrigins: rawConfig.ALLOWED_ORIGINS,
    },

    db: {
        mongoUri: rawConfig.MONGO_URI,
    },

    auth: {
        jwtSecret: rawConfig.JWT_SECRET,
        authDomain: rawConfig.AUTH_DOMAIN,
        cookieHost: rawConfig.COOKIE_HOST,
    },

    apis: {
        host: {
            baseUrl: rawConfig.API_BASE_URL,
        },
        xrapid: {
            hostKey: rawConfig.API_HOST_KEY,
            hostName: rawConfig.API_HOST_NAME,
        },
        goodreads: {
            baseUrl: rawConfig.GOODREADS_BASE_URL,
            apiKey: rawConfig.GOODREADS_API_KEY,
            apiHost: rawConfig.GOODREADS_API_HOST,
        },
        annasArchive: {
            baseUrl: rawConfig.ANNAS_ARCHIVE_BASE_URL,
            apiKey: rawConfig.ANNAS_ARCHIVE_API_KEY,
            apiHost: rawConfig.ANNAS_ARCHIVE_API_HOST,
        },
        bbooks: {
            baseUrl: rawConfig.BBOOKS_API_BASE_URL,
            apiKey: rawConfig.BBOOKS_API_KEY,
            apiHost: rawConfig.BBOOKS_API_HOST,
        },
        openLib: {
            baseUrl: rawConfig.OPEN_LIBRARY_BASE_URL,
            userAgent: rawConfig.OPEN_LIBRARY_USER_AGENT,
        },
        gutenberg: {
            baseUrl: rawConfig.GUTENBERG_API_BASE_URL,
        },
    },

    paths: {
        clientDistPath: rawConfig.CLIENT_SHELF_DIST_PATH,
        adminDistPath: rawConfig.ADMIN_SHELF_DIST_PATH,
        scoreDir: rawConfig.SCORE_DATA_DIRPATH,
        get scoreDataDirResolved() {
            return path.resolve(rawConfig.SCORE_DATA_DIRPATH);
        },
    }
}

export const clientConfig = {
    env: rawConfig.NODE_ENV,
    appName: rawConfig.APP_NAME,
    isDev: rawConfig.NODE_ENV === 'dev',
    isProd: rawConfig.NODE_ENV === 'prod',
    api: {
        baseUrl: rawConfig.API_BASE_URL
    }
}

export type Config = typeof config;
export type ClientConfig = typeof clientConfig;

export const { server, db, auth, apis, paths } = config;