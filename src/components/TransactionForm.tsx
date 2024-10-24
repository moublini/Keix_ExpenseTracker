import { useState } from "react";

export interface TransactionFormObject {
    onSubmit: (name: string, amount: number) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormObject) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);

    return (
        <div>
            <label htmlFor="transaction-name">Text</label>
            <input required onChange={e => setName(e.target.value)} id="transaction-name" className="rounded-md p-2 border w-full mb-2" type="text" placeholder="Enter text..." />

            <label htmlFor="transaction-amount">Amount</label>
            <input onChange={e => setAmount(+e.target.value) } id="transaction-text" className="rounded-md p-2 border w-full mb-2" type="text" placeholder="Enter amount..." />

            <button className="rounded-md bg-purple-400 text-white p-2 text-center w-full" onClick={() => {
                onSubmit(name, amount);
            }}>Add transaction</button>
        </div>
    );
}