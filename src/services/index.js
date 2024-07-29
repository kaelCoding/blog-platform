import { keyMessApi } from "@/key/key"

const lang = "en"

export const processError = (error) => {
    let errorMess = keyMessApi[lang][error]
    
    alert(errorMess)
}