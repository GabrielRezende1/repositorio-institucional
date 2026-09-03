<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthCheck } from '@/composables/useAuthCheck'
import { useFormValidation } from '@/composables/useFormValidation'
import MenuBar from '@/components/MenuBar.vue'
import { getDocumentForEdit, updateDocument } from '@/services/documentService'

const route = useRoute()
const router = useRouter()
const auth = useAuthCheck()
auth.checkOut()

const { formErrors, formSuccess, setError, setSuccess, clearMessages } = useFormValidation()
const isStudent = ref(false)
const student = ref('')
const teacher = ref('')
const teachers = ref([])
const today = computed(() => {
    return new Date().toISOString().split('T')[0]
})

const form = reactive({
    title: '',
    abstract: '',
    type: '',
    keywords: '',
    advisor: '',
    date: '',
    doc_id: route.params.id,
    file: null
})

async function updateDoc() {
    clearMessages()
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('abstract', form.abstract);
    formData.append('type', form.type);
    formData.append('keywords', form.keywords);
    formData.append('advisor', form.advisor);
    formData.append('date', form.date);
    if (form.file) {
        formData.append('file', form.file);
    }
    console.log(formData)

    const result = await updateDocument(form.doc_id, formData)
    if (result.success) {
        setSuccess('Documento atualizado com sucesso!');
        setTimeout(() => {
            router.push('/minha-conta/meus-documentos')
        }, 2000);
    } else {
        setError(result.error);
        console.log(result.error);
    }
}

function handleFileUpload(event) {
    form.file = event.target.files[0];
}

onMounted(async () => {
    const result = await getDocumentForEdit(form.doc_id)
    if (!result.success) {
        console.log(result.error)
        return
    }
    isStudent.value = result.data.isStudent
    student.value = result.data.student
    teacher.value = result.data.teacher
    teachers.value = result.data.teachers

    const doc = result.data.doc
    const keywords = result.data.docKeyword
    form.title = doc.nome_doc
    form.abstract = doc.resumo
    form.type = doc.Doc_tipo.tipo
    for (let i = 0; i < keywords.length; i++) {
        if (i == keywords.length - 1) {
            form.keywords += `${keywords[i].Palavra_chave.nome}`
        }else {
            form.keywords += `${keywords[i].Palavra_chave.nome}, `
        }
    }
    form.advisor = doc.Docente.nome
    form.date = doc.data
})  
</script>

<template>
    <MenuBar />
    <section>
        <h2>Alterar Documento</h2>
        <form action="" method="put" @submit.prevent="updateDoc" enctype="multipart/form-data">
            <label for="title">TÍTULO:</label>
            <input type="text" id="title" v-model="form.title" placeholder="Insira o título do documento..." />

            <label for="abstract">DESCRIÇÃO:</label>
            <textarea id="abstract" v-model="form.abstract" placeholder="Descreva o documento..."></textarea>

            <label for="type">TIPO DE DOCUMENTO:</label>
            <select id="type" v-model="form.type">
                <option value="" selected>Selecione uma opção</option>
                <option value="Artigo de Evento">Artigo de Evento</option>
                <option value="Artigo de Periódico">Artigo de Periódico</option>
                <option value="Capítulo de Livro">Capítulo de Livro</option>
                <option value="Dissertação">Dissertação</option>
                <option value="Livro">Livro</option>
                <option value="Monografia">Monografia</option>
                <option value="Tese">Tese</option>
                <option value="Trabalho de Conclusão de Curso">Trabalho de Conclusão de Curso</option>
            </select>

            <label for="keywords">PALAVRAS-CHAVE:</label>
            <input type="text" id="keywords" v-model="form.keywords" placeholder="Separe as palavras-chave por vírgula...">

            <label v-if="isStudent" for="advisors">ORIENTADOR:</label>
            <select v-if="isStudent" id="advisors" v-model="form.advisor">
                <option value="">Selecione um orientador</option>
                <option v-for="advisor in teachers" :key="advisor.id_docente" :value="advisor.nome">{{ advisor.nome }}</option>
            </select>

            <label for="date">ANO:</label>
            <input type="date" min="2012-10-29" :max="today" id="date" v-model="form.date" placeholder="Insira o ano do documento..." />

            <label for="file">ARQUIVO (PDF) - Deixar em branco para manter o atual:</label>
            <input type="file" id="file" @change="handleFileUpload" accept=".pdf" />

            <input type="submit" value="ATUALIZAR DOCUMENTO" />

            <span v-if="formSuccess" class="success">{{ formSuccess }}</span>
            <span v-if="formErrors" class="error">{{ formErrors }}</span>
        </form>
    </section>
</template>

<style scoped>
section {
    width: 100%;
    max-width: 1280px;
    min-height: calc(100vh - 300px);
    /** 150px from headerPartial and footer */
    margin: 0 auto;
}

h2 {
    padding: 2rem 1rem 0 1rem;
    margin: 0;
}

form {
    width: 100%;
    padding: 1rem;
}

label {
    font-size: 16px;
    color: var(--black);
    font-weight: 600;
    display: block;
    margin-top: 1rem;
}

input[type=text],
input[type=number],
select,
textarea,
input[type=file] {
    display: block;
    width: 100%;
    padding: 0.5rem;
    font-size: 16px;
    margin: 0.5rem 0 1rem 0;
    border-radius: 5px;
    outline: 0;
    border: 1px solid #ccc;
    box-sizing: border-box;

    transition: 0.3s;
}

input[type=text]:focus,
input[type=number]:focus,
select:focus,
textarea:focus {
    border-color: var(--blue);
    box-shadow: 0 0 5px rgba(0, 100, 200, 0.3);
}

textarea {
    resize: vertical;
    min-height: 100px;
}

input[type=submit] {
    display: block;
    width: 250px;
    height: 48px;

    font-size: 20px;
    font-weight: 600;
    margin: 2rem auto 1rem auto;
    border-radius: 10px;
    border: 0;
    background-color: var(--yellow);
    color: var(--black);
    cursor: pointer;

    transition: 0.4s;
}

input[type=submit]:hover {
    background-color: var(--blue);
    color: white;
    font-size: 22px;
}

.success {
    display: block;
    margin: 1rem auto;
    width: fit-content;
    background-color: rgba(0, 255, 0, 0.3);
    border-radius: 5px;
    padding: 0 5px;
    color: green;
    font-weight: 600;
}

.error {
    display: block;
    margin: 1rem auto;
    width: fit-content;
    background-color: rgba(255, 0, 0, 0.3);
    border-radius: 5px;
    padding: 0 5px;
    color: red;
    font-weight: 600;
}

/** Media Queries
 */

@media screen and (max-width: 800px) {
    h2 {
        text-align: center;
        padding: 0;
    }
}
</style>