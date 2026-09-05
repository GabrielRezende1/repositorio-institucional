<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getDocumentsByType } from '@/services/documentService'
import { useFileDownload } from '@/composables/useFileDownload'
import { useDocumentList } from '@/composables/useDocumentList'

const route = useRoute()
const docType = ref(route.params.tipo.replace(/\+/g, ' '))
const { downloadDocumentFile } = useFileDownload()
const {
    paginatedDocuments,
    totalPages,
    currentPage,
    load,
    previousPage,
    handleNextPage
} = useDocumentList(getDocumentsByType)
const docTypeLabels = {
    'artigo de evento': 'Artigo de Evento',
    'artigo de periodico': 'Artigo de Periódico',
    'capitulo de livro': 'Capítulo de Livro',
    'dissertacao': 'Dissertação',
    'livro': 'Livro',
    'monografia': 'Monografia',
    'tese': 'Tese',
    'tcc': 'Trabalho de Conclusão de Curso'
}

async function fetchDocuments(tipo) {
    await load(tipo)
    docType.value = tipo.replace(/\+/g, ' ');
}

async function downloadFile(id_doc, nome_arq) {
    await downloadDocumentFile(id_doc, nome_arq)
}

onBeforeMount(() => {
    fetchDocuments(route.params.tipo);
})

watch(() => route.params.tipo, (tipo) => {
    fetchDocuments(tipo)
})
</script>

<template>
    <section>
        <h2>Documentos - {{ docTypeLabels[docType] || docType }}</h2>

        <nav class="categorias">
            <ul>
                <li>
                    <RouterLink to="/documento/tipo/artigo+de+evento" class="category-link">
                        Artigo de Evento
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/artigo+de+periodico" class="category-link">
                        Artigo de Periódico
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/capitulo+de+livro" class="category-link">
                        Capítulo de Livro
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/dissertacao" class="category-link">
                        Dissertação
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/livro" class="category-link">
                        Livro
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/monografia" class="category-link">
                        Monografia
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/tese" class="category-link">
                        Tese
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/tcc" class="category-link">Trabalho de
                        Conclusão de Curso
                    </RouterLink>
                </li>
            </ul>
        </nav>

        <div v-if="paginatedDocuments.length" class="documents-list">
            <div v-for="documento in paginatedDocuments" :key="documento.id_documento" class="doc-card">
                <h3>{{ documento.nome_doc }}</h3>
                <div v-if="documento.Discente">
                    <p><strong>Autores:</strong> {{ documento.Discente.nome }}</p>
                </div>
                <div v-else>
                    <p><strong>Autores:</strong> {{ documento.Docente.nome }}</p>
                </div>
                <p><strong>Data:</strong> {{ documento.data }}</p>
                <p><strong>Resumo:</strong> {{ documento.resumo?.substring(0, 150) }}...</p>
                <div class="actions">
                    <RouterLink :to="'/documento/id/' + documento.id_documento" class="action-btn">Ver Detalhes
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