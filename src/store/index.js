import { initAuth } from "./auth"

export const init_store = async () => {
    await initAuth();
}