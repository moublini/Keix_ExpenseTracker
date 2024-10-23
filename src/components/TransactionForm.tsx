import { useRef } from "react";

export interface TransactionFormObject {
    onSubmit: (name: string, amount: number) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormObject) {
    const transactionNameRef = useRef<HTMLInputElement>(null);
    const transactionAmountRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <label htmlFor="transaction-name">Text</label>
            <input required ref={transactionNameRef} id="transaction-name" className="rounded-md p-2 border w-full mb-2" type="text" placeholder="Enter text..." />

            <label htmlFor="transaction-amount">Amount</label>
            <input ref={transactionAmountRef} id="transaction-text" className="rounded-md p-2 border w-full mb-2" type="text" placeholder="Enter amount..." />

            <button className="rounded-md bg-purple-400 text-white p-2 text-center w-full" onClick={() => {
                const name = transactionNameRef.current!.value;
                const amount = +transactionAmountRef.current!.value;
                onSubmit(name, amount);
            }}>Add transaction</button>
        </div>
    );
}