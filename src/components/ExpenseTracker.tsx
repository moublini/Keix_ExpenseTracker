import { useState, useEffect } from "react";
import { TransactionObject, Transaction } from "./Transaction";
import { TransactionForm } from "./TransactionForm";

export function ExpenseTracker() {
    const [ transactions, setTransactions ] = useState([
        { amount: 500, name: 'Cash' },
        { amount: -40, name: 'Book' },
        { amount: -200, name: 'Camera' },
    ] as TransactionObject[]);

    const [ balance, setBalance ] = useState(0);
    const [ income, setIncome ] = useState(0);

    useEffect(() => {
        console.log('effect called'); // Why is it called twice on page load?
        let newBalance = 0, newIncome = 0;
        for (const transaction of transactions) {
            newBalance += transaction.amount;
            if (transaction.amount > 0)
                newIncome += transaction.amount;
        }

        setBalance(newBalance);
        setIncome(newIncome);
    }, [ transactions ])

    return (
        <div className="max-w-xl flex flex-col gap-8 p-4">
            <h1 className="text-center text-3xl font-bold">Expense Tracker</h1>

            <section className="flex flex-col gap-4">
                <hgroup>
                    <h2>YOUR BALANCE</h2>
                    <p className="text-3xl"><strong>${balance.toFixed(2)}</strong></p>
                </hgroup>

                <div className="rounded-md bg-white shadow-md flex">
                    <div className="text-center p-4 flex-1">
                        <h3 className="balance__data-title">Income</h3>
                        <span className="text-green-400">${income.toFixed(2)}</span>
                    </div>
                    <div className="text-center p-4 flex-1">
                        <h3 className="balance__data-title">Expense</h3>
                        <span className="text-red-600">${(income - balance).toFixed(2)}</span>
                    </div>
                </div>
            </section>
          
            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold border-b-2">History</h2>
                <ul className="flex flex-col gap-2">
                    {
                        transactions.map((transaction, index) => (
                            <li key={`history-item-${index}`} >
                                <Transaction onDelete={() => { setTransactions([ ...transactions.slice(0, index), ...transactions.slice(index + 1) ]) }} obj={transaction}></Transaction>
                            </li>
                        ))
                    }
                </ul>
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold border-b-2">Add new transaction</h2>
                <TransactionForm onSubmit={(name, amount) => setTransactions([{name, amount}, ...transactions])}></TransactionForm>
            </section>
        </div>
    )
}