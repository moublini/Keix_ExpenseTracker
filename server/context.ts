import { TRPCError } from "@trpc/server";
import { prisma } from './prisma_client';
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { users } from "@prisma/client";
import { decode, JwtPayload } from "jsonwebtoken";

type UserData = Omit<users, 'password'>

async function fetchUserData(name: string, password: string): Promise<UserData> {
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

async function handleBasicAuth(credentials: string): Promise<UserData> {
    const [ name, password ] = credentials.split(':')
    return fetchUserData(name, password);
}

async function handleJWTAuth(token: string): Promise<UserData> {
    type Payload = JwtPayload & { name: string, password: string };

    const payload = decode(token, { json: true }) as Payload | null;
    if (!payload) 
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Incorrect JWT passed.',
        });

    return fetchUserData(payload.name, payload.password);
}

export async function createContext({ req }: CreateHTTPContextOptions) {
    const { authorization } = req.headers;
    if (!authorization)
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Authorization header format is invalid (<AuthType> <name:pwd>)',
        });

    const [ authType, credentials ] = authorization.split(' ');
    if (!credentials) {
        return {};
    }

    let userData: UserData;
    switch (authType) {
        case 'Basic':
            userData = await handleBasicAuth(credentials);
            break;

        case 'Bearer':
            userData = await handleJWTAuth(credentials);
            break;

        default:
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Authorization type is not supported.',
            });
    }

    return {
        userData,
    }
}

export type Context = Awaited<ReturnType<typeof createContext>>