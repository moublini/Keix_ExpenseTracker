import { TransactionObject } from "../../server";

export interface TransactionProps {
    onDelete: () => void,
    obj: TransactionObject,
}

export function Transaction({ obj, onDelete }: TransactionProps) {
    return (
        <div onClick={onDelete} className={`bg-white active:bg-gray-100 hover:bg-gray-100 p-2 shadow-md border-r-4 ${obj.amount > 0 ? 'border-green-400' : 'border-red-600'}`}>
            <div className="flex">
                <span className="flex-1">{obj.name}</span>
                <span className="text-right">{obj.amount}</span>
            </div>
        </div>
    );
}
