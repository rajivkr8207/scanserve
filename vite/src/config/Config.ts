
type Config = {
    Backend_URL: string
}

export const Env: Config = {
    Backend_URL: import.meta.env.VITE_BACKEND_URL
}