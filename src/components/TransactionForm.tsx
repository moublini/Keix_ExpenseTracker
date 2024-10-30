import { trpc } from "../trpc";
import { SubmitHandler, useForm } from "react-hook-form";

export interface TransactionFormProps {
    onSubmit: SubmitHandler<TransactionFormSchema>;
}

export interface TransactionFormSchema {
    name: string,
    amount: number,
    receiver_user_id: number,
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
    const { register, handleSubmit, formState } = useForm<TransactionFormSchema>();
    const { errors } = formState;
    const users = trpc.getManyUsers.useQuery();
    const currentUser = trpc.getUserInfo.useQuery();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="transaction-name">Text</label>
            <input {...register('name', { required: true })} id="transaction-name" className="rounded-md p-2 border w-full mb-2" type="text" placeholder="Enter text..." />
            {errors.name && (<span className="text-red-300">Transaction name is required.</span>)}

            <label htmlFor="transaction-amount">Amount</label>
            <input {...register('amount', { required: true, validate: val => val > 0 })} id="transaction-text" className="rounded-md p-2 border w-full mb-2" type="number" placeholder="Enter amount..." />
            {errors.amount && (<span className="text-red-300">Transaction amount is required and must be greater than 0.</span>)}

            <label htmlFor="transaction-amount">Send To</label>
            <select className="bg-white p-2 rounded-md border w-full mb-2" {...register('receiver_user_id', { required: true, validate: val => val !== -1})}>
                <option value="-1">Choose a user</option>
                {
                    users.data
                        ?.filter?.(user => user.id !== currentUser.data?.id)
                        ?.map?.(user => (
                            <option key={`user-${user.id}`} value={user.id}>{user.name}</option>
                        ))
                }
            </select>
            {errors.receiver_user_id && (<span className="text-red-300">Select a transaction receiver.</span>)}

            <button type="submit" className="rounded-md bg-purple-400 text-white p-2 text-center w-full">Add transaction</button>
        </form>
    );
}