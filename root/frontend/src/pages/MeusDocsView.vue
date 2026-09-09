<script setup>
import MenuBar from '@/components/MenuBar.vue'
import { RouterLink } from 'vue-router'
import { useFileDownload } from '@/composables/useFileDownload'
import { useUserDocuments } from '@/composables/useUserDocuments'

const { documents, loading, error, load, remove } = useUserDocuments()
const { downloadDocumentFile } = useFileDownload()

async function deleteDoc(documento_id) {
    const result = await remove(documento_id)
    if (!result.success) {
        alert(result.error?.message || result.error || 'Erro ao deletar documento')
        return
    }
    alert('Documento deletado com sucesso!')
}

async function downloadFile(id_doc, nome_arq) {
    await downloadDocumentFile(id_doc, nome_arq)
}

load()

</script>

<template>
    <MenuBar />
    <section class="page-section">
        <h2 class="page-heading">Meus Documentos</h2>
        <p v-if="loading">Carregando documentos...</p>
        <p v-else-if="error" class="error-message">
            {{ error?.message || error }}
        </p>
        <table v-else-if="documents.length" class="data-table">
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
                        <RouterLink :to="'/documento/id/' + document.id_documento" class="btn action-btn">Visualizar</RouterLink>
                        <RouterLink :to="'/minha-conta/meus-documentos/alterar-documento/' + document.id_documento" class="btn action-btn">Alterar
                        </RouterLink>
                        <button @click="deleteDoc(document.id_documento)" class="btn delete-btn">Deletar</button>
                        <button @click="downloadFile(document.id_documento, document.nome_arq)" class="btn secondary-btn download-btn">Download</button>
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
.data-table td:last-child {
    text-align: left;
}

.data-table td:last-child .btn {
    margin: 0.2rem;
}

@media screen and (max-width: 800px) {
    .data-table,
    .data-table thead,
    .data-table tbody,
    .data-table th,
    .data-table td,
    .data-table tr {
        display: block;
    }

    .data-table thead {
        display: none;
    }

    .data-table tr {
        margin-bottom: 1rem;
        border: 1px solid var(--color-border);
        background: #fff;
    }

    .data-table td {
        position: relative;
        padding-left: 45%;
    }

    .data-table td::before {
        content: attr(data-label);
        position: absolute;
        left: 0.75rem;
        top: 0.9rem;
        font-weight: 700;
        color: var(--color-primary);
    }
}
</style>