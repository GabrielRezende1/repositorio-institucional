<script setup>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const allDocuments = ref([])
const displayedDocuments = ref([])
const searchInput = ref('')
const currentPage = ref(1)
const documentsPerPage = 5

function search() {
    const searchTerm = searchInput.value.toLowerCase();
    displayedDocuments.value = allDocuments.value.filter(doc =>
        doc.titulo.toLowerCase().includes(searchTerm) ||
        doc.autores.toLowerCase().includes(searchTerm) ||
        doc.descricao.toLowerCase().includes(searchTerm)
    );
    currentPage.value = 1;
}

function downloadFile(id_doc, nome_arq) {
    axios.get('http://localhost:3000/api/download/' + id_doc + '/' + nome_arq,
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

function previousPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
}

function nextPage() {
    const totalPages = Math.ceil(displayedDocuments.value.length / documentsPerPage);
    if (currentPage.value < totalPages) {
        currentPage.value++;
    }
}

const paginatedDocuments = computed(() => {
    const startIndex = (currentPage.value - 1) * documentsPerPage;
    const endIndex = startIndex + documentsPerPage;
    return displayedDocuments.value.slice(startIndex, endIndex);
})

const totalPages = computed(() => {
    return Math.ceil(displayedDocuments.value.length / documentsPerPage);
})

onMounted(() => {
    const searchQuery = route.query.search;

    axios.get('http://localhost:3000/api/documento')
        .then(res => {
            allDocuments.value = res.data;
            displayedDocuments.value = res.data;

            if (searchQuery) {
                searchInput.value = searchQuery;
                search();
            }

            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
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
            <div v-for="documento in paginatedDocuments" :key="documento.documento_id" class="doc-card">
                <h3>{{ documento.titulo }}</h3>
                <p><strong>Área:</strong> {{ documento.tipo_documento }}</p>
                <p><strong>Autores:</strong> {{ documento.autores }}</p>
                <p><strong>Ano:</strong> {{ documento.ano }}</p>
                <p><strong>Descrição:</strong> {{ documento.descricao.substring(0, 200) }}...</p>
                <div class="actions">
                    <RouterLink :to="'/documento/' + documento.documento_id" class="action-btn">Ver Detalhes
                    </RouterLink>
                    <button @click="downloadFile(documento.id_documento, documento.nome_arq)" class="action-btn download-btn">Download</button>
                </div>
            </div>
        </div>
        <div v-else class="no-results">
            <p>Nenhum documento encontrado.</p>
        </div>

        <div v-if="totalPages > 1" class="pagination">
            <button @click="previousPage" :disabled="currentPage === 1" class="pagination-btn">← Anterior</button>
            <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">Próxima →</button>
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