<script setup>
import axios from 'axios'
import MenuBar from '@/components/MenuBar.vue'
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router'
import { useAuthCheck } from '@/composables/useAuthCheck'

const auth = useAuthCheck()
auth.checkOut()

const documents = ref([])

function deleteDocument(documento_id) {
    axios.delete('http://localhost:3000/api/minha-conta/meus-documentos/' + documento_id, { withCredentials: true })
        .then(res => {
            if (res.status == 200) {
                documents.value = documents.value.filter(d => d.documento_id !== documento_id);
                alert("Documento deletado com sucesso!");
            }
        })
        .catch(err => {
            alert(err.response.data);
            console.log(err.response.data);
        });
}

function downloadFile(nome_arq) {
    axios.get('http://localhost:3000/api/download/' + nome_arq,
        { responseType: 'blob' })
        .then(res => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(
                new Blob([res.data], { type: 'application/pdf' })
            );
            document.body.appendChild(link);
            link.setAttribute('download', nome_arq);
            link.click();
            link.remove();
            URL.revokeObjectURL(link.href);
        })
        .catch(err => {
            console.log(err.response.data);
        });
}

onMounted(() => {
    axios.get('http://localhost:3000/api/minha-conta/meus-documentos', { withCredentials: true })
        .then(res => {
            documents.value = res.data.docs;
            console.log(res.data);
        })
        .catch(err => {
            console.log(err.response.data);
        })
})

</script>

<template>
    <MenuBar />
    <section>
        <h2>Meus Documentos</h2>
        <table v-if="documents.length">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Data de submissão</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="document in documents" :key="document.id_documento">
                    <td>{{ document.nome_doc }}</td>
                    <td>{{ document.Doc_tipo.tipo }}</td>
                    <td>{{ new Date(document.data).toLocaleDateString() }}</td>
                    <td>
                        <RouterLink :to="'/documento/id/' + document.id_documento" class="action">Visualizar</RouterLink>
                        <RouterLink :to="'/minha-conta/meus-documentos/alterar-documento/' + document.id_documento" class="action">Alterar
                        </RouterLink>
                        <button @click="deleteDocument(document.id_documento)" class="delete-btn">Deletar</button>
                        <button @click="downloadFile(document.nome_arq)" class="download-btn">Download</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else>
            <p>Você não possui documentos cadastrados.</p>
        </div>
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

table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    margin: 1rem 0;
}

table tr:nth-child(even) {
    background-color: #D6EEEE;
}

table th {
    background-color: var(--blue);
    color: white;
    padding: 12px;
    text-align: left;
    font-weight: 600;
}

table td {
    border-top: 2px solid var(--blue);
    padding: 12px;
    text-align: center;
}

table td:first-child {
    text-align: left;
}

.action,
.delete-btn,
.download-btn {
    display: inline-block;
    padding: 8px 12px;
    margin: 0 4px;
    border-radius: 5px;
    border: 0;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s;
    text-decoration: none;
}

.action {
    background-color: var(--yellow);
    color: var(--black);
    font-weight: 600;
}

.action:hover {
    background-color: var(--blue);
    color: white;
}

.delete-btn {
    background-color: rgba(255, 0, 0, 0.7);
    color: white;
    font-weight: 600;
}

.delete-btn:hover {
    background-color: red;
}

.download-btn {
    background-color: var(--blue);
    color: white;
    font-weight: 600;
}

.download-btn:hover {
    background-color: darkblue;
}

p {
    padding: 2rem 1rem;
    text-align: center;
    font-size: 18px;
}

/** Media Queries
 */

@media screen and (max-width: 800px) {
    h2 {
        text-align: center;
        padding: 0;
    }

    table,
    thead,
    tbody,
    th,
    td,
    tr {
        display: block;
    }

    table tr {
        margin-bottom: 15px;
        display: block;
        border: 1px solid #ddd;
    }

    table th {
        position: absolute;
        top: -9999px;
        left: -9999px;
    }

    table td {
        position: relative;
        padding-left: 50%;
    }

    table td:before {
        content: attr(data-label);
        position: absolute;
        left: 6px;
        font-weight: bold;
    }
}
</style>