<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDocumentForm } from '@/composables/useDocumentForm'
import MenuBar from '@/components/MenuBar.vue'
import { getDocumentForEdit, updateDocument } from '@/services/documentService'

const route = useRoute()
const router = useRouter()

const isStudent = ref(false)
const student = ref('')
const teacher = ref('')
const teachers = ref([])
const today = computed(() => {
    return new Date().toISOString().split('T')[0]
})

const {
    form,
    formErrors,
    formSuccess,
    submit,
    handleFileUpload
} = useDocumentForm({
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
    const result = await submit((formData) => updateDocument(form.doc_id, formData))
    if (result.success) {
        setTimeout(() => {
            router.push('/minha-conta/meus-documentos')
        }, 2000);
    }
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
    <section class="page-section">
        <h2 class="page-heading">Alterar Documento</h2>
        <form action="" method="put" @submit.prevent="updateDoc" enctype="multipart/form-data" class="page-form">
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

            <div class="form-actions">
                <input type="submit" value="ATUALIZAR DOCUMENTO" class="btn primary-btn" />
            </div>

            <span v-if="formSuccess" class="status-message success">{{ formSuccess }}</span>
            <span v-if="formErrors" class="status-message error">{{ formErrors }}</span>
        </form>
    </section>
</template>

<style scoped>
.page-form {
    max-width: 1100px;
}
</style>