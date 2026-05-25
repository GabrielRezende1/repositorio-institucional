<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDocumentsByType, downloadDocument } from '@/services/documentService'

const route = useRoute()
const docType = ref(route.params.tipo.replace(/\+/g, ' '))
const documents = ref([])
const displayedDocuments = ref([])
const currentPage = ref(1)
const documentsPerPage = 5
const docTypes = [
    'artigo+de+evento',
    'artigo+de+periodico',
    'capitulo+de+livro',
    'dissertacao',
    'livro',
    'monografia',
    'tese',
    'trabalho+de+conclusao+de+curso'
]
const docTypeLabels = {
    'artigo de evento': 'Artigo de Evento',
    'artigo de periodico': 'Artigo de Periódico',
    'capitulo de livro': 'Capítulo de Livro',
    'dissertacao': 'Dissertação',
    'livro': 'Livro',
    'monografia': 'Monografia',
    'tese': 'Tese',
    'trabalho de conclusao de curso': 'Trabalho de Conclusão de Curso'
}

async function fetchDocuments(tipo) {
    const result = await getDocumentsByType(tipo)
    if (!result.success) {
        console.log(result.error);
        return
    }
    documents.value = result.data;
    displayedDocuments.value = result.data;
    docType.value = tipo.replace(/\+/g, ' ');
    currentPage.value = 1;
    console.log(result.data);
}

async function downloadFile(id_doc, nome_arq) {
    const result = await downloadDocument(id_doc, nome_arq)
    if (!result.success) {
        console.log(result.error);
        return
    }
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(
        new Blob([result.data], { type: 'application/pdf' })
    );
    document.body.appendChild(link);
    link.setAttribute('download', nome_arq);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
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
    fetchDocuments(route.params.tipo);
})
</script>

<template>
    <section>
        <h2>Documentos - {{ docTypeLabels[docType] || docType }}</h2>

        <nav class="categorias">
            <ul>
                <li>
                    <RouterLink to="/documento/tipo/artigo+de+evento" class="category-link">Artigo de Evento
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/artigo+de+periodico" class="category-link">Artigo de Periódico
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/capitulo+de+livro" class="category-link">Capítulo de Livro
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/dissertacao" class="category-link">Dissertação</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/livro" class="category-link">Livro</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/monografia" class="category-link">Monografia</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/tese" class="category-link">Tese</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/trabalho+de+conclusao+de+curso" class="category-link">Trabalho de
                        Conclusão de Curso</RouterLink>
                </li>
            </ul>
        </nav>

        <div v-if="paginatedDocuments.length" class="documents-list">
            <div v-for="documento in paginatedDocuments" :key="documento.documento_id" class="doc-card">
                <h3>{{ documento.titulo }}</h3>
                <p><strong>Autores:</strong> {{ documento.autores }}</p>
                <p><strong>Ano:</strong> {{ documento.ano }}</p>
                <p><strong>Descrição:</strong> {{ documento.descricao.substring(0, 150) }}...</p>
                <div class="actions">
                    <RouterLink :to="'/documento/' + documento.documento_id" class="action-btn">Ver Detalhes
                    </RouterLink>
                    <button @click="downloadFile(documento.id_documento, documento.nome_arq)" class="action-btn download-btn">Download</button>
                </div>
            </div>
        </div>
        <div v-else class="no-results">
            <p>Nenhum documento encontrado nesta categoria.</p>
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

nav.categorias {
    list-style-type: none;
    margin: 2rem 0;
}

nav.categorias ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    list-style: none;
    padding: 0;
    margin: 0;
}

nav.categorias ul li {
    display: inline-block;
    margin: 0.5rem;
}

.category-link {
    display: block;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 600;
    background-color: var(--yellow);
    color: var(--black);
    border-radius: 5px;
    text-decoration: none;
    transition: 0.3s;
}

.category-link:hover {
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
    .documents-list {
        grid-template-columns: 1fr;
    }

    nav.categorias ul {
        flex-direction: column;
        align-items: center;
    }
}
</style>