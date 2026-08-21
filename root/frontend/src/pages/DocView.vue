<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAllDocuments } from '@/services/documentService'
import { useFileDownload } from '@/composables/useFileDownload'
import { usePagination } from '@/composables/usePagination'
import { useDocumentSearch } from '@/composables/useDocumentSearch'

const route = useRoute()
const allDocuments = ref([])
const displayedDocuments = ref([])
const { downloadDocumentFile } = useFileDownload()
const { currentPage, previousPage, nextPage, getPaginatedItems, getTotalPages, resetPagination } = usePagination(5)
const { searchInput, searchDocuments, clearSearch } = useDocumentSearch()

function search() {
    displayedDocuments.value = searchDocuments(allDocuments.value)
    resetPagination()
}

async function downloadFile(id_doc, nome_arq) {
    await downloadDocumentFile(id_doc, nome_arq)
}

function handlePreviousPage() {
    previousPage()
}

function handleNextPage() {
    nextPage(displayedDocuments.value.length)
}

const paginatedDocuments = computed(() => {
    return getPaginatedItems(displayedDocuments.value);
})

const totalPages = computed(() => {
    return getTotalPages(displayedDocuments.value.length);
})

onMounted(async () => {
    const searchQuery = route.query.search;
    const result = await getAllDocuments()
    if (!result.success) {
        console.log(result.error);
        return
    }
    allDocuments.value = result.data.docRows;
    displayedDocuments.value = result.data.docRows;
    if (searchQuery) {
        searchInput.value = searchQuery;
        search();
    }
    console.log(result.data);
})
</script>

<template>
    <section>
        <h2>Documentos</h2>

        <div class="search-container">
            <input v-model="searchInput" type="text" placeholder="Buscar por título, autor ou descrição..."
                class="search-input" />
            <button @click="search" class="search-btn">Buscar</button>
        </div>

        <div v-if="paginatedDocuments.length" class="documents-list">
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
                <div class="actions">
                    <RouterLink :to="'/documento/id/' + doc.id_documento" class="action-btn">Ver Detalhes
                    </RouterLink>
                    <button @click="downloadFile(doc.id_documento, doc.nome_arq)" class="action-btn download-btn">Download</button>
                </div>
            </div>
        </div>
        <div v-else class="no-results">
            <p>Nenhum documento encontrado.</p>
        </div>

        <div v-if="totalPages > 1" class="pagination">
            <button @click="handlePreviousPage" :disabled="currentPage === 1" class="pagination-btn">← Anterior</button>
            <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="handleNextPage" :disabled="currentPage === totalPages" class="pagination-btn">Próxima →</button>
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
    padding: 1rem;
}

h2 {
    text-align: center;
    margin: 1rem 0;
    color: var(--blue);
}

.search-container {
    display: flex;
    gap: 10px;
    margin: 2rem 0;
    justify-content: center;
}

.search-input {
    width: 60%;
    max-width: 500px;
    padding: 12px;
    font-size: 16px;
    border: 2px solid var(--blue);
    border-radius: 5px;
    outline: none;
}

.search-input:focus {
    box-shadow: 0 0 5px rgba(0, 100, 200, 0.3);
}

.search-btn {
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    background-color: var(--yellow);
    color: var(--black);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
}

.search-btn:hover {
    background-color: var(--blue);
    color: white;
}

.documents-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin: 2rem 0;
}

.doc-card {
    border: 2px solid var(--blue);
    border-radius: 10px;
    padding: 20px;
    background-color: #f9f9f9;
    transition: 0.3s;
}

.doc-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
}

.doc-card h3 {
    color: var(--blue);
    margin-top: 0;
}

.doc-card p {
    margin: 8px 0;
    font-size: 14px;
}

.actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
}

.action-btn {
    flex: 1;
    min-width: 100px;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: 0.3s;
}

.action-btn {
    background-color: var(--yellow);
    color: var(--black);
}

.action-btn:hover {
    background-color: var(--blue);
    color: white;
}

.download-btn {
    background-color: var(--blue);
    color: white;
}

.download-btn:hover {
    background-color: darkblue;
}

.no-results {
    text-align: center;
    padding: 2rem;
    font-size: 18px;
    color: #666;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin: 2rem 0;
}

.pagination-btn {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    background-color: var(--yellow);
    color: var(--black);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
}

.pagination-btn:hover:not(:disabled) {
    background-color: var(--blue);
    color: white;
}

.pagination-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.page-info {
    font-weight: 600;
    color: var(--blue);
}

@media screen and (max-width: 800px) {
    .search-container {
        flex-direction: column;
    }

    .search-input {
        width: 100%;
    }

    .documents-list {
        grid-template-columns: 1fr;
    }
}
</style>