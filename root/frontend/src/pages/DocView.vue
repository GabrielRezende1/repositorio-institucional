<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAllDocuments } from '@/services/documentService'
import { useFileDownload } from '@/composables/useFileDownload'
import { useDocumentList } from '@/composables/useDocumentList'

const route = useRoute()
const { downloadDocumentFile } = useFileDownload()
const {
    paginatedDocuments,
    totalPages,
    currentPage,
    searchInput,
    load,
    search,
    previousPage,
    handleNextPage
} = useDocumentList(getAllDocuments)

async function downloadFile(id_doc, nome_arq) {
    await downloadDocumentFile(id_doc, nome_arq)
}

function handlePreviousPage() {
    previousPage()
}

onMounted(async () => {
    const searchQuery = route.query.search
    if (searchQuery) {
        searchInput.value = searchQuery
    }
    await load()
    if (searchQuery) search()
})
</script>

<template>
    <section class="page-section">
        <h2 class="page-heading">Documentos</h2>

        <div class="search-container">
            <input
                v-model="searchInput"
                type="text"
                placeholder="Buscar por título, autor ou descrição..."
                class="search-input"
            />
            <button @click="search" class="btn search-btn">Buscar</button>
        </div>

        <div v-if="paginatedDocuments.length" class="documents-grid">
            <div v-for="doc in paginatedDocuments" :key="doc.id_documento" class="doc-card">
                <h3>{{ doc.nome_doc }}</h3>
                <p><strong>Tipo:</strong> {{ doc.Doc_tipo.tipo }}</p>
                <div v-if="doc.Discente">
                    <p><strong>Autores:</strong> {{ doc.Discente.nome }}</p>
                </div>
                <div v-else>
                    <p><strong>Autores:</strong> {{ doc.Docente.nome }}</p>
                </div>
                <p><strong>Data:</strong> {{ doc.data }}</p>
                <p><strong>Descrição:</strong> {{ doc.resumo.substring(0, 200) }}...</p>
                <div class="page-actions">
                    <RouterLink :to="'/documento/id/' + doc.id_documento" class="btn action-btn">
                        Ver Detalhes
                    </RouterLink>
                    <button @click="downloadFile(doc.id_documento, doc.nome_arq)" class="btn secondary-btn download-btn">
                        Download
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="no-results">
            <p>Nenhum documento encontrado.</p>
        </div>

        <div v-if="totalPages > 1" class="pagination">
            <button @click="handlePreviousPage" :disabled="currentPage === 1" class="btn pagination-btn">
                ← Anterior
            </button>
            <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="handleNextPage" :disabled="currentPage === totalPages" class="btn pagination-btn">
                Próxima →
            </button>
        </div>
    </section>
</template>

<style scoped>
.search-container {
    display: flex;
    gap: 10px;
    margin: 2rem 0;
    justify-content: center;
}

.search-input {
    width: 60%;
    max-width: 500px;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    border: 2px solid var(--color-primary);
    border-radius: var(--radius-sm);
    outline: none;
}

.search-input:focus {
    box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.no-results {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
    color: #666;
}

@media screen and (max-width: 600px) {
    .search-container {
        flex-direction: column;
    }

    .search-input {
        width: 100%;
    }
}
</style>