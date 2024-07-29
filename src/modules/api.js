import { token } from "@/store/auth"
import { baseAPI } from "@/key/key"


export const api = async (path, param) => {
    let url = `${baseAPI}/${path}`
        if (token.value) {
            url = url + `?access_token=${token.value}&${param}`
        } else {
            url = url + `?${param}`
        }

        const res = await fetch(url)
        const data = await res.json()
        
        if(data.ok){
            return data.result
        } else {
            throw data.error
        }
}