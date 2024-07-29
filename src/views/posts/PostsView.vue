<script setup>
import { ref } from "vue"
import { onBeforeMount } from "vue";
import { getListPostsApi } from "@/services/post";

onBeforeMount(async () => {
    await getListPosts()
})

const total_count = ref(0)
const pages = ref([])

const getListPosts = async () => {
    try {
        const data = await getListPostsApi()

        total_count.value = data.total_count
        pages.value = data.pages
    } catch (error) {
        console.log(error)
    }
}
</script>

<template>
    <div>
        <h1>List Post</h1>
        <div>
            Total Post {{  total_count }}

            <RouterLink to="/posts/create">Create Post</RouterLink>
        </div>
        <hr>
        <div v-for="page of pages" :key="page.path">
            <RouterLink :to="`/posts/${page.path}`">
                <h2> {{ page.title }}</h2>
            </RouterLink>
            <h3> {{ page.description }}</h3>
            <RouterLink :to="`/posts/${page.path}/update`">Update</RouterLink>
            <hr>
        </div>
    </div>
</template>

<style scpoed>

</style>