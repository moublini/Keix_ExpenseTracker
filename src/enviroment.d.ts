declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET_KEY: string;
            DATABASE_URL: string;
        }
    }
}

export { };
