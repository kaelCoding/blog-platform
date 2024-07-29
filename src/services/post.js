import { api } from "@/modules/api"
import { processError } from ".";

export const getListPostsApi = async (limit) => {
    let limitDefault = 10;
    if(limit) {
        limitDefault = limit
    }

    try {
        const data = await api("/getPageList", `limit=${limitDefault}`)
        return data
    } catch (error) {
        processError(error)
        throw error;
    }
}

export const createPostApi = async (title, author_name, content, return_content) => {
    try {
        const data = await api("/createPage", `title=${title}&author_name=${author_name}&content=${content}&return_content=${return_content}`)

        return data
    } catch (error) {
        processError(error)
        throw error;
    }
}

export const getPostApi = async (path) => {
    try {
        const data = await api(`/getPage/${path}`, "return_content=true")
        
        return data
    } catch (error) {
        processError(error)
        throw error;
    }
}

export const updatePostApi = async (path, title, author_name, content, return_content) => {
    try {
        const data = await api(`/editPage/${path}`, `title=${title}&author_name=${author_name}&content=${content}&return_content=${return_content}`)
        
        return data
    } catch (error) {
        processError(error)
        throw error;
    }
}