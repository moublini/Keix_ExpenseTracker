import { z } from 'zod';
import cors from 'cors';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { protectedProcedure, publicProcedure, router } from "./trpc";
import { PrismaClient } from '@prisma/client';
import { createContext } from './context';

const prisma = new PrismaClient();

const appRouter = router({
    /* Public Procedures */
    getManyTransactions: publicProcedure
        .query(async () => await prisma.transactions.findMany()),

    getTransaction: publicProcedure
        .input(z.number())
        .query(async (opts) => {
            const inputId = opts.input
            return await prisma.transactions.findFirst({
                where: { id: inputId, }
            })
        }),

    getUserInfo: protectedProcedure
        .query(async (opts) => {
            const { ctx } = opts;
            return await prisma.users.findFirst({
                where: { id: ctx.userId },
            });
        }),

    getUserTransactions: protectedProcedure
        .query(async (opts) => {
            const { ctx } = opts;
            return await prisma.transactions.findMany({
                where: { user_id: ctx.userId },
            })
        }),

    addTransaction: protectedProcedure
        .input(z.object({ name: z.string(), amount: z.number() }))
        .mutation(async (opts) => {
            const { ctx, input } = opts;
            const transaction = await prisma.transactions.create({
                data: { user_id: ctx.userId, ...input },
            });

            // Update user's balance, income, expense and transactions list.
            await prisma.users.update({
                where: { id: opts.ctx.userId, },
                data: {
                    balance: { increment: transaction.amount, },
                    income: { increment: transaction.amount > 0 ? transaction.amount : 0 },
                    expense: { increment: transaction.amount < 0 ? -transaction.amount : 0 },
                },
            });

            return transaction;
        }),

    deleteTransaction: protectedProcedure
        .input(z.number())
        .mutation(async (opts) => {
            const transaction = await prisma.transactions.delete({
                where: { id: opts.input },
            })

            // Update user's balance, income, expense and transactions list.
            await prisma.users.update({
                where: { id: opts.ctx.userId, },
                data: {
                    balance: { decrement: transaction.amount, },
                    income: { decrement: transaction.amount > 0 ? transaction.amount : 0 },
                    expense: { decrement: transaction.amount < 0 ? -transaction.amount : 0 },
                },
            })

            return transaction;
        }),
})

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    router: appRouter,
    middleware: cors(),
    createContext,
});

server.listen(8080);