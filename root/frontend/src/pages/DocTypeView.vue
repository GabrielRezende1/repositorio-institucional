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
    <section class="page-section">
        <h2 class="page-heading">Documentos - {{ docTypeLabels[docType] || docType }}</h2>

        <nav class="categorias">
            <ul>
                <li>
                    <RouterLink to="/documento/tipo/artigo+de+evento" class="btn category-link">
                        Artigo de Evento
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/artigo+de+periodico" class="btn category-link">
                        Artigo de Periódico
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/capitulo+de+livro" class="btn category-link">
                        Capítulo de Livro
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/dissertacao" class="btn category-link">
                        Dissertação
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/livro" class="btn category-link">
                        Livro
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/monografia" class="btn category-link">
                        Monografia
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/tese" class="btn category-link">
                        Tese
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/tcc" class="btn category-link">Trabalho de
                        Conclusão de Curso
                    </RouterLink>
                </li>
            </ul>
        </nav>

        <div v-if="paginatedDocuments.length" class="documents-grid">
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
                <div class="page-actions">
                    <RouterLink :to="'/documento/id/' + documento.id_documento" class="btn action-btn">Ver Detalhes
                    </RouterLink>
                    <button @click="downloadFile(documento.id_documento, documento.nome_arq)" class="btn secondary-btn download-btn">Download</button>
                </div>
            </div>
        </div>
        <div v-else class="no-results">
            <p>Nenhum documento encontrado nesta categoria.</p>
        </div>

        <div v-if="totalPages > 1" class="pagination">
            <button @click="previousPage" :disabled="currentPage === 1" class="btn pagination-btn">← Anterior</button>
            <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="handleNextPage" :disabled="currentPage === totalPages" class="btn pagination-btn">Próxima →</button>
        </div>
    </section>
</template>

<style scoped>
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
    display: inline-flex;
    padding: 0.6rem 0.85rem;
    font-size: 0.85rem;
    font-weight: 700;
}
</style>