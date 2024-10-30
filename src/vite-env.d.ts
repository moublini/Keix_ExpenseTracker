/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_JWT_PUBLIC_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}