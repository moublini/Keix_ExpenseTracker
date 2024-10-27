import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

export async function createContext({ req }: CreateHTTPContextOptions) {
    return {
        userId: 1,
    }
}

export type Context = Awaited<ReturnType<typeof createContext>>