<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentForm } from '@/composables/useDocumentForm'
import { createDocument } from '@/services/documentService'
import { getNewDocumentForm } from '@/services/documentService'
import MenuBar from '@/components/MenuBar.vue'

const router = useRouter()

const {
    form,
    formErrors,
    formSuccess,
    submit,
    handleFileUpload
} = useDocumentForm({
    title: '',
    description: '',
    type: '',
    advisor: '',
    keywords: '',
    date: new Date().toISOString().split('T')[0]
})

const userData = ref({})

async function createDoc() {
    const result = await submit(createDocument)
    if (result.success) {
        setTimeout(() => {
            router.push('/minha-conta/meus-documentos')
        }, 2000)
    }
}

onBeforeMount(async () => {
    const result = await getNewDocumentForm()
    if (!result.success) {
        console.log(result.error);
        return
    }
    userData.value = result.data;
    console.log(result.data);
})
</script>

<template>
    <MenuBar />
    <section class="page-section">
        <h2 class="page-heading">Novo Documento</h2>
        <form action="" method="post" @submit.prevent="createDoc" enctype="multipart/form-data" class="page-form">
            <label for="title">TÍTULO:</label>
            <input type="text" id="title" v-model="form.title" placeholder="Insira o título do documento..." />

            <label for="description">DESCRIÇÃO:</label>
            <textarea id="description" v-model="form.description" placeholder="Resumo do documento..."></textarea>

            <label for="type">TIPO DE DOCUMENTO:</label>
                <select id="type" v-model="form.type">
                <option value="">Selecione uma opção</option>
                <option value="Artigo de Evento">Artigo de Evento</option>
                <option value="Artigo de Periodico">Artigo de Periódico</option>
                <option value="Capítulo de livro">Capítulo de Livro</option>
                <option value="Dissertação">Dissertação</option>
                <option value="Livro">Livro</option>
                <option value="Monografia">Monografia</option>
                <option value="Tese">Tese</option>
                <option value="Trabalho de Conclusão de Curso">Trabalho de Conclusão de Curso</option>
            </select>

            <div v-if="form.type.match(/Trabalho de Conclusão de Curso|Tese|Dissertação|Monografia/)">
                <label for="advisor">ORIENTADOR:</label>
                <select id="advisor" v-model="form.advisor">
                    <option value="" selected>Selecione uma opção</option>
                    <option v-for="advisor in userData.advisors" :key="advisor.Docente.id_docente" :value="advisor.Docente.nome">{{ advisor.Docente.nome }}</option>
                </select>
            </div>

            <label for="">PALAVRAS-CHAVE: (Separar por vírgulas)</label>
            <input type="text" id="keywords" v-model="form.keywords" placeholder="Insira as palavras-chave separadas por vírgula...">

            <label for="data">DATA:</label>
            <input type="date" id="date" v-model="form.date" placeholder="Insira a data do documento..." />

            <label for="file">ARQUIVO (PDF):</label>
            <input type="file" id="file" @change="handleFileUpload" accept=".pdf" required />

            <div class="form-actions">
                <input type="submit" value="CRIAR DOCUMENTO" class="btn primary-btn" />
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