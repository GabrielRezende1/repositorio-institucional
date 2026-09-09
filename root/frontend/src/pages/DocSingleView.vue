<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { getDocumentById } from '@/services/documentService'
import { useFileDownload } from '@/composables/useFileDownload'

const route = useRoute()
const documento_id = route.params.id
const doc = ref({})
const { downloadDocumentFile } = useFileDownload()

async function downloadFile(id_doc, nome_arq) {
    await downloadDocumentFile(id_doc, nome_arq)
}

onBeforeMount(async () => {
    const result = await getDocumentById(documento_id)
    if (!result.success) {
        console.log(result.error);
        return
    }
    doc.value = result.data;
    console.log(result.data);
    console.log(doc.value.doc[0]);
})
</script>

<template>
    <section class="page-section">
        <div v-if="doc.doc[0].nome_doc" class="document-card">
            <h2 class="page-heading">{{ doc.doc[0].nome_doc }}</h2>

            <div class="doc-info">
                <div class="info-group">
                    <strong>Tipo de Documento:</strong>
                    <p>{{ doc.doc[0].Doc_tipo.tipo }}</p>
                </div>

                <div class="info-group">
                    <strong>Autores:</strong>
                    <p>{{ doc.doc[0].Discente.nome }}</p>
                </div>

                <div class="info-group">
                    <strong>Ano:</strong>
                    <p>{{ doc.doc[0].data }}</p>
                </div>

                <div class="info-group">
                    <strong>Data de Submissão:</strong>
                    <p>{{ new Date(doc.data_criacao).toLocaleDateString() }}</p>
                </div>

                <div class="info-group description">
                    <strong>Descrição:</strong>
                    <p>{{ doc.doc[0].resumo }}</p>
                </div>
            </div>

            <div class="page-actions">
                <button @click="downloadFile(doc.doc[0].id_documento, doc.doc[0].nome_arq)" class="btn primary-btn">Download do Documento</button>
                <RouterLink to="/documento" class="btn secondary-btn back-btn">Voltar à Lista</RouterLink>
            </div>
        </div>
        <div v-else class="loading">
            <p>Carregando documento...</p>
        </div>
    </section>
</template>

<style scoped>
.document-card {
    background-color: var(--color-surface);
    border: 2px solid var(--color-primary);
    border-radius: var(--radius-md);
    padding: 2rem;
}

.document-card .page-heading {
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
}

.doc-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.25rem;
    margin: 1.25rem 0;
}

.info-group {
    background-color: white;
    padding: 1rem;
    border-radius: var(--radius-sm);
    border-left: 4px solid var(--color-accent);
}

.info-group strong {
    display: block;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.description {
    grid-column: 1 / -1;
    text-align: justify;
}

@media screen and (max-width: 600px) {
    .doc-info {
        grid-template-columns: 1fr;
    }

    .page-actions {
        flex-direction: column;
    }
}
</style>