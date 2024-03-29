<script setup>
import Quill from "quill/dist/quill.js"
import { onMounted, ref } from "vue";
import {useRouter} from "vue-router"
import axios from "axios";
import WarningAlert from "../components/alerts/WarningAlert.vue"

const router = useRouter()

const displayAlert = ref({
    display: false,
    message: null
})

const form = ref({
    title: null,
    body: null,
    related_service: null
})

const relatedServices = ref([])

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
 // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  //[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  //[{ 'font': [] }],
  [{ 'align': [] }],
  ['clean']                                         // remove formatting button
];

const discard = () => {
    router.push('/documentation')
}

const publishDocument = () => {

}

const saveDraft = async () => {
    const timestamp = new Date().toISOString()
    form.value.body = document.getElementsByClassName('ql-editor')[0].innerHTML
    await axios.post('/create/document/draft', {
        title: form.value.title,
        text: form.value.body,
        timestamp: timestamp,
        related_service: form.value.related_service
    }).then((res) => {
        if (res.data.status === 'success') {
            router.push('/documentation')
        } else {
            if (res.data.status === 'failed') {
                displayAlert.value.display = true
                displayAlert.value.message = res.data.message
            }
        }
    }).catch((err) => {
        console.error(err.response.data)
    })
}

onMounted(() => {
    new Quill("#editor", {
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Document Body...',
        theme: 'snow'
    })
    axios.get('/api/services').then((res) => {
        relatedServices.value = res.data.services
    }).catch((err) => {
        console.error(err.response.data)
    })
})
</script>

<template>
    <WarningAlert v-if="displayAlert.display" :alertMessage="displayAlert.message"/>
        <div class="document-form-wrapper">
            <form @submit.prevent="publishDocument()">
                <div class="flex f-gap-1 mb-2">
                    <button type="submit" class="btn btn-success">Publish</button>
                    <button type="button" @click="saveDraft()" class="btn btn-secondary">Save Draft</button>
                    <button type="button" @click="discard()" class="btn btn-danger">Discard</button>
                </div>
                <div class=" flex f-align-center">
                    <div>
                        <input type="text" name="title" id="title" class="new-document-title" placeholder="Document Title..." v-model="form.title">
                    </div>
                    <div id="related_service_div">
                        <select name="related_service" id="related_service" v-model="form.related_service">
                            <option v-for="service in relatedServices" :value="service.service_id">{{service.title}}</option>
                        </select>
                    </div>
                </div>
                <div id="editor"></div>
                <input style="display:none;" type="text" name="comment_post_value" id="comment_post_value" v-model="form.body">
            </form>
        </div>
</template>

<style scoped>
#editor{
    height: calc(100vh - 16em);
}
</style>