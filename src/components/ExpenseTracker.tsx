import { Transaction } from "./Transaction";
import { TransactionForm } from "./TransactionForm";
import { trpc } from '../trpc';
import { transactions } from "@prisma/client";

export function ExpenseTracker() {
    const transactions = trpc.getUserTransactions.useQuery();
    const user = trpc.getUserInfo.useQuery()

    function updateTransactionData() {
        transactions.refetch();
        user.refetch();
    }

    const addTransaction = trpc.addTransaction.useMutation({
        onSuccess: updateTransactionData,
    });

    const deleteTransaction = trpc.deleteTransaction.useMutation({
        onSuccess: updateTransactionData,
    });

    return (
        <div className="max-w-xl flex flex-col gap-8 p-4">
            <h1 className="text-center text-3xl font-bold">Expense Tracker</h1>
            <h2 className="text-center text-xl">Welcome back, {user.data?.name}.</h2>

            <section className="flex flex-col gap-4">
                <hgroup>
                    <h2>YOUR BALANCE {user.data?.balance && user.data.balance < 0 && "Dumbass, you broke!" }</h2>
                    <p className="text-3xl"><strong>${user.data?.balance}</strong></p>
                </hgroup>

                <div className="rounded-md bg-white shadow-md flex">
                    <div className="text-center p-4 flex-1">
                        <h3 className="balance__data-title">Income</h3>
                        <span className="text-green-400">${user.data?.income}</span>
                    </div>
                    <div className="text-center p-4 flex-1">
                        <h3 className="balance__data-title">Expense</h3>
                        <span className="text-red-600">${user.data?.expense}</span>
                    </div>
                </div>
            </section>
          
            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold border-b-2">History</h2>
                <ul className="flex flex-col gap-2">
                    {
                        transactions.data?.map?.((transaction, index) => {
                            const mappedTransaction: transactions = {
                                ...transaction,
                                timestamp: new Date(transaction.timestamp),
                            };

                            return (
                                <li key={`history-item-${index}`} >
                                    <Transaction onDelete={() => { deleteTransaction.mutate(transaction.id) }} obj={mappedTransaction}></Transaction>
                                </li>
                            );
                        })
                    }
                </ul>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold border-b-2">Add new transaction</h2>
                <TransactionForm onSubmit={(name, amount, receiver_user_id) => { addTransaction.mutate({ name, amount, receiver_user_id }) }}></TransactionForm>
            </section>
        </div>
    )
}