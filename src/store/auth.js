import { computed, ref } from "vue";

export const token = ref(null)

export const setToken = (tkn) => {
    token.value = tkn
    localStorage.setItem("TOKEN", tkn)
}

export const getToken = () => {
    token.value = localStorage.getItem("TOKEN")
}

export const authInfo = ref(null)

export const isLoggedIn = computed(() => {
    if(authInfo.value){
        return true
    }
    return false
})

export const getAuthInfo = async () => {
    try {
        const res = await fetch(`https://api.telegra.ph/getAccountInfo?access_token=${token.value}`)

        const data = await res.json()

        if(data.ok){
            authInfo.value = data.result
            console.log(authInfo.value)
        }
        else {
            alert(data.error)
        }
    } catch (error) {
        console.log(error)
    }
}

export const initAuth = async () => {
    getToken()

    if(token.value) {
        await getAuthInfo();
    }
}
