import { z } from 'zod';
import cors from 'cors';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { procedure, router } from "./trpc";

export interface TransactionObject {
    id: number,
    name: string,
    amount: number,
}

let nextId = 0;
let balance = 0;
let income = 0;
let expense = 0;
let transactions: TransactionObject[] = [];

const appRouter = router({
    getIncome: procedure
        .query(async () => income),

    getExpense: procedure
        .query(async () => expense),

    getBalance: procedure
        .query(async () => balance),

    getManyTransactions: procedure
        .query(async () => transactions),

    getTransaction: procedure
        .input(z.number())
        .query(async (opts) => {
            const inputId = opts.input
            return transactions.find(transaction => transaction.id === inputId);
        }),

    addTransaction: procedure
        .input(z.object({ name: z.string(), amount: z.number() }))
        .mutation(async (opts) => {
            const transactionData = opts.input;
            const newTransaction: TransactionObject = { id: nextId, ...transactionData };

            nextId++;
            balance += newTransaction.amount;

            if (newTransaction.amount > 0)
                income += newTransaction.amount;
            else
                expense -= newTransaction.amount;

            transactions.push(newTransaction);

            return newTransaction;
        }),

    deleteTransaction: procedure
        .input(z.number())
        .mutation(async (opts) => {
            const transactionId = opts.input;
            const transactionIndex = transactions.findIndex(transaction => transaction.id === transactionId);
            if (transactionIndex === -1)
                return undefined;

            const transactionToDelete = transactions[transactionIndex];
            balance -= transactionToDelete.amount;

            if (transactionToDelete.amount > 0)
                income -= transactionToDelete.amount;
            else
                expense += transactionToDelete.amount;

            transactions = [...transactions.slice(0, transactionIndex), ...transactions.slice(transactionIndex + 1)]

            return 
        }),
})

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
    router: appRouter,
    middleware: cors(),
});

server.listen(8080);