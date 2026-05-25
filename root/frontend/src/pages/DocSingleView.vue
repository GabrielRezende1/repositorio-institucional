<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { getDocumentById, downloadDocument } from '@/services/documentService'

const route = useRoute()
const documento_id = route.params.id
const doc = ref({})

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
    <section>
        <div v-if="doc.doc[0].nome_doc" class="document-container">
            <h2>{{ doc.doc[0].nome_doc }}</h2>

            <div class="doc-info">
                <div class="info-group">
                    <strong>Tipo de Documento:</strong>
                    <p>{{ doc.doc[0].Doc_tipo.tipo }}</p>
                </div>

                <div class="info-group">
                    <!--TODO: Create computed property to change name based on user role-->
                    <strong>Autores:</strong>
                    <p>{{ doc.doc[0].Discente.nome }}</p>
                </div>

                <div class="info-group">
                    <strong>Ano:</strong>
                    <p>{{ doc.doc[0].data }}</p>
                </div>

                <div class="info-group">
                    <!--TODO: Only works if I enable timestamps in backend database-->
                    <strong>Data de Submissão:</strong>
                    <p>{{ new Date(doc.data_criacao).toLocaleDateString() }}</p>
                </div>

                <div class="info-group">
                    <strong>Descrição:</strong>
                    <p class="description">{{ doc.doc[0].resumo }}</p>
                </div>
            </div>

            <div class="actions">
                <button @click="downloadFile(doc.doc[0].id_documento, doc.doc[0].nome_arq)" class="download-btn">Download do Documento</button>
                <RouterLink to="/documento" class="back-btn">Voltar à Lista</RouterLink>
            </div>
        </div>
        <div v-else class="loading">
            <p>Carregando documento...</p>
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
    padding: 2rem 1rem;
}

.document-container {
    background-color: #f9f9f9;
    border: 2px solid var(--blue);
    border-radius: 10px;
    padding: 30px;
}

h2 {
    color: var(--blue);
    margin-top: 0;
    border-bottom: 2px solid var(--blue);
    padding-bottom: 15px;
}

.doc-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.info-group {
    background-color: white;
    padding: 15px;
    border-radius: 5px;
    border-left: 4px solid var(--yellow);
}

.info-group strong {
    display: block;
    color: var(--blue);
    margin-bottom: 8px;
    font-size: 16px;
}

.info-group p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
}

.description {
    text-align: justify;
    grid-column: 1 / -1;
}

.actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
    justify-content: center;
}

.download-btn,
.back-btn {
    padding: 12px 30px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    transition: 0.3s;
}

.download-btn {
    background-color: var(--yellow);
    color: var(--black);
}

.download-btn:hover {
    background-color: var(--blue);
    color: white;
}

.back-btn {
    background-color: var(--blue);
    color: white;
    display: inline-block;
}

.back-btn:hover {
    background-color: darkblue;
}

.loading {
    text-align: center;
    padding: 50px;
    font-size: 18px;
    color: var(--blue);
}

@media screen and (max-width: 600px) {
    .doc-info {
        grid-template-columns: 1fr;
    }

    .actions {
        flex-direction: column;
    }

    .download-btn,
    .back-btn {
        width: 100%;
    }
}
</style>