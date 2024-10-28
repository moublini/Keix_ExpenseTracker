import { useState } from "react";
import { trpc } from "../trpc";

export interface TransactionFormObject {
    onSubmit: (name: string, amount: number, sender_user_id: number) => void;
}

export function TransactionForm({ onSubmit }: TransactionFormObject) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);
    const [receiverUserId, setReceiverUserId] = useState(0);
    const users = trpc.getManyUsers.useQuery();

    return (
        <div>
            <label htmlFor="transaction-name">Text</label>
            <input required onChange={e => setName(e.target.value)} id="transaction-name" className="rounded-md p-2 border w-full mb-2" type="text" placeholder="Enter text..." />

            <label htmlFor="transaction-amount">Amount</label>
            <input onChange={e => setAmount(+e.target.value) } id="transaction-text" className="rounded-md p-2 border w-full mb-2" type="text" placeholder="Enter amount..." />

            <label htmlFor="transaction-amount">SendTo</label>
            <select className="w-full" onChange={e => setReceiverUserId(+e.target.value)}>
                {
                    users.data?.map?.(user => (
                        <option key={`user-${user.id}`} value={user.id}>{user.name}</option>
                    ))
                }
            </select>

            <button className="rounded-md bg-purple-400 text-white p-2 text-center w-full" onClick={() => {
                onSubmit(name, amount, receiverUserId);
            }}>Add transaction</button>
        </div>
    );
}