import { api } from "@/modules/api"
import { processError } from ".";

export const registerAPI = async (shortName, authorName) => {
    try {
        const data = await api("/createAccount", `short_name=${shortName}&author_name=${authorName}`)
        return data;
    } catch (error) {
        processError(error)
        throw error;
    }
}

export const updateAuthApi = async (shortName, authorName) => {
    try {
        const data = await api("/editAccountInfo", `short_name=${shortName}&author_name=${authorName}`)
        return data;
    } catch (error) {
        processError(error)

        throw error
    }
}