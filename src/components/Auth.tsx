import { useState } from "react";
import { trpc } from "../trpc";

export function Auth() {
    const credentials = localStorage.getItem('keix_auth_credentials')?.split(':') ?? [];
    const [ name, setName ] = useState(credentials[0] ?? '');
    const [ password, setPassword ] = useState(credentials[1] ?? '');
    const [ isRegistering, setIsRegistering ] = useState(false)
    const createUser = trpc.addUser.useMutation()

    const registerUser = () => createUser.mutateAsync({ name, password });
    const loginUser = () => localStorage.setItem('keix_auth_credentials', `${name}:${password}`);

    return (
        <form
            className="flex flex-col gap-2"
            action=""
            onSubmit={async e => {
                e.preventDefault();
                if (isRegistering) await registerUser();
                loginUser();
                window.location.reload();
            } }
        >
            <label htmlFor="auth-name">Username</label>
            <input className="rounded-md border p-2" type="text" id="auth-name" value={name} onChange={e => setName(e.target.value)} />

            <label htmlFor="auth-password">Password</label>
            <input className="rounded-md border p-2" type="text" id="auth-password" value={password} onChange={e => setPassword(e.target.value)} />

            <label htmlFor="auth-register">Register?</label>
            <input type="checkbox" id="auth-register" onChange={e => setIsRegistering(e.target.checked)}/>

            <button className="text-white rounded-md bg-purple-400 p-2" type="submit">{ isRegistering ? 'Register' : 'Login' }</button>
        </form>
    )
}