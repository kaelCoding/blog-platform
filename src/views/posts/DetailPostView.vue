<script setup>
import { getPostApi } from '@/services/post';
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { nodeToDom, domToNode } from '@/modules/editor';

const route = useRoute()
const path = computed(() => {
    return route.params.path
})

onBeforeMount(async () => {
    getPost()
})

const getPost = async () => {
    try {
        await getPostApi(path.value).then(res => {
            const node = nodeToDom({
                children: res.content
            })

            contentElm.value.appendChild(node)
        })
    } catch (error) {
        console.log(error)
    }
}

const contentElm = ref(null)

</script>

<template>
    <div>
        <h1>{{ path }}</h1>
        <div class="content" ref="contentElm">

        </div>
    </div>
</template>