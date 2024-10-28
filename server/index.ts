import { z } from 'zod';
import cors from 'cors';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { protectedProcedure, publicProcedure, router } from "./trpc";
import { prisma } from './prisma_client';
import { createContext } from './context';
import { TRPCError } from '@trpc/server';

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

    getManyUsers: publicProcedure
        .query(async () => {
            return await prisma.users.findMany({
                select: {
                    id: true,
                    name: true,
                    balance: true,
                    income: true,
                    expense: true,
                }
            })
        }),

    getUserById: protectedProcedure
        .input(z.number())
        .query(async (opts) => {
            const id = opts.input;
            return await prisma.users.findFirst({ where: { id }, });
        }),

    getUserInfo: protectedProcedure
        .query(async (opts) => {
            const { userData } = opts.ctx;
            return await prisma.users.findFirst({
                where: { id: userData.id },
            });
        }),

    addUser: publicProcedure
        .input(z.object({
            name: z.string(),
            password: z.string(),
        }))
        .mutation(async (opts) => {
            const { input: newUserData } = opts;
            console.log(newUserData)
            return await prisma.users.create({ data: newUserData });
        }),

    getUserTransactions: protectedProcedure
        .query(async (opts) => {
            const { userData } = opts.ctx;
            return await prisma.transactions.findMany({
                where: {
                    OR: [
                        { sender_user_id: userData.id },
                        { receiver_user_id: userData.id },
                    ],
                },
            });
        }),

    addTransaction: protectedProcedure
        .input(z.object({
            name: z.string(),
            amount: z.number(),
            receiver_user_id: z.number(),
        }))
        .mutation(async (opts) => {
            const { ctx, input } = opts;
            if (input.amount < 0)
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: "A transaction's amount can't be negative.",
                });

            const transaction = await prisma.transactions.create({
                data: {
                    timestamp: new Date(),
                    sender_user_id: ctx.userData.id,
                    ...input,
                },
            });

            console.log(`users: ${transaction.sender_user_id}, ${transaction.receiver_user_id}`)

            console.log("about to update users...")
            // Update sender's balance, income, expense and transactions list.
            await prisma.users.update({
                where: { id: transaction.sender_user_id },
                data: {
                    balance: { decrement: transaction.amount },
                    expense: { increment: transaction.amount },
                },
            });
            console.log("modified sender's data")
            // Update receiver's balance, income, expense and transactions list.
            await prisma.users.update({
                where: { id: transaction.receiver_user_id },
                data: {
                    balance: { increment: transaction.amount },
                    income: { increment: transaction.amount },
                },
            });
            console.log("modified receiver's data")

            return transaction;
        }),

    deleteTransaction: protectedProcedure
        .input(z.number())
        .mutation(async (opts) => {
            const { userData } = opts.ctx;
            const transaction = await prisma.transactions.delete({
                where: {
                    id: opts.input,
                    OR: [
                        { sender_user_id: userData.id },
                        { receiver_user_id: userData.id },
                    ],
                },
            });

            if (!transaction)
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: "Unauthorized request to delete transaction without being its sender or receiver.",
                });

            // Update sender's balance, income, expense and transactions list.
            await prisma.users.update({
                where: { id: transaction.sender_user_id },
                data: {
                    balance: { increment: transaction.amount },
                    expense: { decrement: transaction.amount },
                },
            });

            // Update receiver's balance, income, expense and transactions list.
            await prisma.users.update({
                where: { id: transaction.receiver_user_id },
                data: {
                    balance: { decrement: transaction.amount },
                    income: { decrement: transaction.amount },
                },
            });

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