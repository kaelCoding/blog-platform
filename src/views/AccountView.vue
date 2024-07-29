<script setup>
import { authInfo } from '@/store/auth';
import { updateAuthApi } from "@/services/auth"
import { ref } from 'vue';

const accountInfo = ref({
    short_name: authInfo.value.short_name,
    author_name: authInfo.value.author_name
})

const save = async () => {
    try {
        await updateAuthApi(accountInfo.value.short_name, accountInfo.value.author_name).then(res => {
            authInfo.value.short_name = res.short_name
            authInfo.value.author_name = res.author_name
        })
    } catch (error) {
        console.log(error)
    }
}
</script>

<template>
    <div>
        <h1>Account manager</h1>
        <form @submit.prevent="save">
            <label for="">Short Name:</label>
            <input v-model="accountInfo.short_name" type="text" placeholder="Enter short name">
            <br>
            <label for="">Author Name: </label>
            <input v-model="accountInfo.author_name" type="text" placeholder="Enter author name">
            <br>
            <button type="submit">Save</button>
        </form>
    </div>
</template>