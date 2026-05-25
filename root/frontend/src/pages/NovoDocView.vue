<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthCheck } from '@/composables/useAuthCheck'
import MenuBar from '@/components/MenuBar.vue'

const router = useRouter()
const auth = useAuthCheck()
auth.checkOut()

const titulo = ref('')
const descricao = ref('')
const tipo = ref('')
const autores = ref('')
const ano = ref(new Date().getFullYear())
const arquivo = ref(null)
const sucesso = ref('')
const erros = ref('')

function createDocument() {
    const formData = new FormData();
    formData.append('titulo', titulo.value);
    formData.append('descricao', descricao.value);
    formData.append('tipo', tipo.value);
    formData.append('autores', autores.value);
    formData.append('ano', ano.value);
    formData.append('arquivo', arquivo.value);

    axios.post('http://localhost:3000/api/novo-documento',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        }
    )
        .then(res => {
            if (res.status == 201) {
                sucesso.value = "Documento criado com sucesso!";
                setTimeout(() => {
                    router.push("/meus-documentos");
                }, 2000);
            }
        })
        .catch(err => {
            erros.value = err.response.data.message;
            console.log(err.response.data);
        });
}

function handleFileUpload(event) {
    arquivo.value = event.target.files[0];
}
</script>

<template>
    <MenuBar />
    <section>
        <h2>Novo Documento</h2>
        <form action="" method="post" @submit.prevent="createDocument" enctype="multipart/form-data">
            <label for="titulo">TÍTULO:</label>
            <input type="text" id="titulo" v-model="titulo" placeholder="Insira o título do documento..." />

            <label for="descricao">DESCRIÇÃO:</label>
            <textarea id="descricao" v-model="descricao" placeholder="Descreva o documento..."></textarea>

            <label for="tipo">TIPO DE DOCUMENTO:</label>
            <select id="tipo" v-model="tipo">
                <option value="">Selecione uma opção</option>
                <option value="artigo_de_evento">Artigo de Evento</option>
                <option value="artigo_de_periodico">Artigo de Periódico</option>
                <option value="capitulo_de_livro">Capítulo de Livro</option>
                <option value="dissertacao">Dissertação</option>
                <option value="livro">Livro</option>
                <option value="monografia">Monografia</option>
                <option value="tese">Tese</option>
                <option value="trabalho_de_conclusao_de_curso">Trabalho de Conclusão de Curso</option>
            </select>

            <label for="autores">AUTORES:</label>
            <input type="text" id="autores" v-model="autores" placeholder="Insira os autores do documento..." />

            <label for="ano">ANO:</label>
            <input type="number" id="ano" v-model="ano" placeholder="Insira o ano do documento..." />

            <label for="arquivo">ARQUIVO (PDF):</label>
            <input type="file" id="arquivo" @change="handleFileUpload" accept=".pdf" required />

            <input type="submit" value="CRIAR DOCUMENTO" />

            <span v-if="sucesso" class="success">{{ sucesso }}</span>
            <span v-if="erros" class="error">{{ erros }}</span>
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