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
    <section>
        <h2>Novo Documento</h2>
        <form action="" method="post" @submit.prevent="createDoc" enctype="multipart/form-data">
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

            <input type="submit" value="CRIAR DOCUMENTO" />

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