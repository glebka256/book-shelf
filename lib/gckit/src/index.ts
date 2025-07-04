/**
 * Global configuration for the book-shelf system
 */

// === UTILITIES ===
export {
    getTimeStamp,
    isISO8601,
    toWhitespace,
    toUnderscore,
    setArrayWhitespace
} from './util';

// === LOGGING ===
export { Logger } from './logger/Logger';
export { TextLoader } from './logger/TextLoader';

// === CONFIGURATION ===
export {
    gconfig,
    gclientConfig,
    server,
    db,
    auth,
    apis,
    paths
} from './config';

// === TYPES ===
export type {
    GConfig,
    GClientConfig
} from './config';

// === CONVENIENCE EXPORTS ===
// Common utility functions grouped for easy access
export const utils = {
    getTimeStamp,
    isISO8601,
    toWhitespace,
    toUnderscore,
    setArrayWhitespace
} as const;

// Configuration objects grouped for easy access
export const config = {
    global: gconfig,
    client: gclientConfig,
    server,
    db,
    auth,
    apis,
    paths
} as const;

// Types namespace for explicit type access
export namespace Types {
    export type Config = GConfig;
    export type ClientConfig = GClientConfig;
}

// Re-export individual imports for convenience
import { getTimeStamp, isISO8601, toWhitespace, toUnderscore, setArrayWhitespace } from './util';
import { Logger } from './logger/Logger';
import { TextLoader } from './logger/TextLoader';
import { gconfig, gclientConfig, server, db, auth, apis, paths } from './config';
import type { GConfig, GClientConfig } from './config';

// Default export for when the entire library is imported as a single object
export default {
    utils: {
        getTimeStamp,
        isISO8601,
        toWhitespace,
        toUnderscore,
        setArrayWhitespace
    },
    Logger,
    TextLoader,
    config: {
        global: gconfig,
        client: gclientConfig,
        server,
        db,
        auth,
        apis,
        paths
    }
} as const;