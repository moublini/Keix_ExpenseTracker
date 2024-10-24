import { Transaction } from "./Transaction";
import { TransactionForm } from "./TransactionForm";
import { trpc } from '../trpc';

export function ExpenseTracker() {
    const transactions = trpc.getManyTransactions.useQuery();
    const balance = trpc.getBalance.useQuery();
    const income = trpc.getIncome.useQuery();
    const expense = trpc.getExpense.useQuery();

    function updateTransactionData() {
        transactions.refetch();
        balance.refetch();
        income.refetch();
        expense.refetch();
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

            <section className="flex flex-col gap-4">
                <hgroup>
                    <h2>YOUR BALANCE</h2>
                    <p className="text-3xl"><strong>${balance.data}</strong></p>
                </hgroup>

                <div className="rounded-md bg-white shadow-md flex">
                    <div className="text-center p-4 flex-1">
                        <h3 className="balance__data-title">Income</h3>
                        <span className="text-green-400">${income.data}</span>
                    </div>
                    <div className="text-center p-4 flex-1">
                        <h3 className="balance__data-title">Expense</h3>
                        <span className="text-red-600">${expense.data}</span>
                    </div>
                </div>
            </section>
          
            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold border-b-2">History</h2>
                <ul className="flex flex-col gap-2">
                    {
                        transactions.data?.map?.((transaction, index) => (
                            <li key={`history-item-${index}`} >
                                <Transaction onDelete={() => { deleteTransaction.mutate(transaction.id) }} obj={transaction}></Transaction>
                            </li>
                        ))
                    }
                </ul>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold border-b-2">Add new transaction</h2>
                <TransactionForm onSubmit={(name, amount) => { addTransaction.mutate({ name, amount }) }}></TransactionForm>
            </section>
        </div>
    )
}