import { TRPCError } from "@trpc/server";
import { prisma } from './prisma_client';
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { users } from "@prisma/client";

async function handleBasicAuth(credentials: string) {
    if (!credentials) return null;

    const [ name, password ] = credentials.split(':')
    const user = await prisma.users.findFirst({
        where: { name, password },
    });

    if (!user)
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invalid or non existing user credentials.',
        });

    const { password: _pwd, ...userData } = user;
    return userData;
}

export async function createContext({ req }: CreateHTTPContextOptions) {
    const { authorization } = req.headers;
    if (!authorization)
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Authorization header format is invalid (<AuthType> <name:pwd>)',
        });

    const [ authType, credentials ] = authorization.split(' ');

    let userData: Omit<users, 'password'> | null;
    switch (authType) {
        case 'Basic':
            userData = await handleBasicAuth(credentials);
            break;

        default:
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Authorization type is not supported.',
            });
    }

    if (!userData) {
        console.log('dati invalidi.')
        return {}
    }

    return {
        userData,
    }
}

export type Context = Awaited<ReturnType<typeof createContext>>