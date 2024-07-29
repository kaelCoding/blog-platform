<script setup>
import { onMounted, ref, computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { createPostApi, getPostApi, updatePostApi } from '@/services/post';
import Quill from 'quill';
import "/public/css/quill.snow.css";
import { authInfo } from "@/store/auth";
import { useRouter } from "vue-router";

const props = defineProps(["type"])

const router = useRouter()
const route = useRoute()

const path = computed(() => {
    return route.params.path
})

onBeforeMount(() => {
    if(props.type == 'UPDATE') {
        getPost()
    }
})

onMounted(() => {
    mountQuill()
})

const getPost = async () => {
    try {
        await getPostApi(path.value).then(res => {
            const delta = res.content.flatMap(convertToDelta)
            editor.setContents(delta)

            title.value = res.title
            author.value = res.author_name
        })
    } catch (error) {
        console.log(error)
    }
}

let editor;
const mountQuill = () => {
    const dataConfig = {
        placeholder: "Write something ...",
        theme: "snow",
        modules: {
            toolbar: {
                container: [
                    [{ 'header': 3 }, { 'header': 4 }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                ],
            },
        },
    };
    editor = new Quill(editorCtnElm.value, dataConfig);
}

const editorCtnElm = ref("editorCtnElm")
const title = ref("")
const author = ref(authInfo.value.author_name)

const savePost = async () => {
    const delta = editor.getContents();
    const contentsNode = convertFormat(delta.ops)

    // return
    if(props.type == 'CREATE') {
        try {
            await createPostApi(title.value, author.value, JSON.stringify(contentsNode), true).then(res => {
                router.push(`/posts/${res.path}`)
            })
        } catch (error) {
            console.log(error)
        }
    } 

    if(props.type == 'UPDATE') {
        try {
            await updatePostApi(path.value, title.value, author.value, JSON.stringify(contentsNode), true).then(res => {
                router.push(`/posts/${res.path}`)
            })
        } catch (error) {
            console.log(error)
        }
    }
}

const convertFormat = (delta) => {
    const node = [];
    let currentParagraph = { tag: "p", attrs: { dir: "auto" }, children: [] };

    for (const operation of delta) {
        const text = operation.insert || ""; 
        const isBold = operation.attributes && operation.attributes.bold;
        const isItalic = operation.attributes && operation.attributes.italic;
        const isUnderline = operation.attributes && operation.attributes.underline;
        const isH3 = operation.attributes && operation.attributes.header == 3;
        const isH4 = operation.attributes && operation.attributes.header == 4;

        if (text.includes("\n")) {
            if(isH3 || isH4) {
                currentParagraph.tag = isH3 ? "h3" : "h4"
                node.push(currentParagraph);
                currentParagraph = { tag: "p", attrs: { dir: "auto" }, children: [] };
            }
            else {
                const lines = text.split("\n");
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    
                    if(i == 0 && node.length >= 0){
                        currentParagraph.children.push(line);
                        node.push(currentParagraph);
                    } else {
                        currentParagraph = { tag: "p", attrs: { dir: "auto" }, children: [] };
                        currentParagraph.children.push(line);

                        if(i != lines.length - 1) {
                            node.push(currentParagraph);
                        }
                    }
                }
            }
        } else {
            if(isBold && isItalic) {
                currentParagraph.children.push({ 
                    tag: "strong", 
                    children: [{ 
                        tag: "em", 
                        children: [text] 
                    }] 
                })
                continue
            }
            if(isBold) {
                currentParagraph.children.push({
                    tag: "strong",
                    children: [text]
                })
                continue
            }
            if(isItalic) {
                currentParagraph.children.push({
                    tag: "em",
                    children: [text]
                })
                continue
            }
            if(isUnderline) {
                currentParagraph.children.push({
                    tag: "u",
                    children: [text]
                })
                continue
            }

            currentParagraph.children.push(text)
        }
    }
    return node
}

const convertToDelta = (block) => {
    const parseNode = (node, parentAttributes = {}) => {
        if (typeof node === 'string') {
            return { insert: node, attributes: parentAttributes };
        }

        let attributes = { ...parentAttributes };
        if (node.tag === 'strong') {
            attributes.bold = true;
        }
        if (node.tag === 'em') {
            attributes.italic = true;
        }
        if (node.tag === 'u') {
            attributes.underline = true;
        }

        return node.children.flatMap(child => parseNode(child, attributes));
    };

    return block.children.flatMap(child => parseNode(child)).concat({ insert: '\n' });
}

// const convertToDelta = (block) => {
//     return block.children.map(child => {
//         if (typeof child == 'string') {
//             return { insert: child };
//         }  else if (child.tag == 'strong') {
//             return { insert: child.children.join(''), attributes: { bold: true } };
//         } else if (child.tag == 'em') {
//             return { insert: child.children.join(''), attributes: { italic: true } }; 
//         } else {
//             return { insert: child.children.join('') };
//         }
//     }).concat({ insert: '\n' });
// };
</script>

<template>
    <div>
        <h1 v-if="type == 'CREATE'">Create Post</h1>
        <h1 v-else>Update Post</h1>

        <div>
            <label for="">Title: </label>
            <input type="text" placeholder="Enter title" v-model="title">
        </div>
        <div>
            <label for="">Author: </label>
            <input type="text" placeholder="Enter author" v-model="author" >
        </div>
        <br>

        <div class="editor-ctn-hover">
            <div class="editorCtn" id="editorCtnElm" ref="editorCtnElm">
            </div>
        </div>
       
        <button @click="savePost">Save</button>
    </div>
</template>

<style scoped>
.editor-ctn-hover {
    position: relative;
}

.editorCtn {
    height: 300px;
}
</style>