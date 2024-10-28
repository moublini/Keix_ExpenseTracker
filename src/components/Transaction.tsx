import { transactions } from "@prisma/client";
import { trpc } from "../trpc";

export interface TransactionProps {
    onDelete: () => void,
    obj: transactions,
}

export function Transaction({ obj, onDelete }: TransactionProps) {
    const user = trpc.getUserInfo.useQuery();
    const sender = trpc.getUserById.useQuery(obj.sender_user_id);
    const receiver = trpc.getUserById.useQuery(obj.receiver_user_id);

    const isReceiver = user.data?.id === obj.receiver_user_id;
    return (
        <div onClick={onDelete} className={`bg-white active:bg-gray-100 hover:bg-gray-100 p-2 shadow-md border-r-4 ${isReceiver ? 'border-green-400' : 'border-red-600'}`}>
            <div className="flex justify-between *:flex-1">
                <span className="">{obj.name}</span>
                <span className="text-center text-gray-400">{obj.timestamp.toLocaleString()}</span>
                <span className="text-right">
                    <span className="text-gray-400">{isReceiver ? `from ${sender.data?.name}` : `to ${receiver.data?.name}`}</span>&nbsp;
                    {obj.amount}$
                </span>
            </div>
        </div>
    );
}
