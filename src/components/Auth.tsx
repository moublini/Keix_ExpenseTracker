import { trpc } from "../trpc";
import { SubmitHandler, useForm } from "react-hook-form";

interface AuthFormSchema {
    name: string,
    password: string,
    isRegistering: boolean;
}

export function Auth() {
    const { register, handleSubmit, formState: {errors} } = useForm<AuthFormSchema>();
    const createUser = trpc.addUser.useMutation()
    const token = trpc.login.useMutation();

    const onSubmit: SubmitHandler<AuthFormSchema> = async data => {
        if (data.isRegistering)
            createUser.mutateAsync({ name: data.name, password: data.password })

        const jwt = await token.mutateAsync({ name: data.name, password: data.password });
        if (!jwt) return;

        localStorage.setItem('keix_auth_jwt', jwt);
        window.location.reload();
    }

    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="auth-name">Username</label>
            <input className="rounded-md border p-2" type="text" id="auth-name" {...register('name', {required: true})} />
            {errors.name && (<span className="text-red-300">Username is required.</span>)}

            <label htmlFor="auth-password">Password</label>
            <input className="rounded-md border p-2" type="text" id="auth-password" {...register('password', {required: true})} />
            {errors.password && (<span className="text-red-300">Password is required.</span>)}

            <div className="flex gap-4">
                <label htmlFor="auth-register">Register?</label>
                <input type="checkbox" id="auth-register" {...register('isRegistering')} />
            </div>

            <button className="text-white rounded-md bg-purple-400 p-2" type="submit">Login</button>
        </form>
    )
}