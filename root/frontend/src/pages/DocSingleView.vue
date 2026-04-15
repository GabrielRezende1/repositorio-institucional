<script>
import axios from 'axios'
export default {
    data() {
        return {
            documento_id: this.$route.params.id,
            documento: {}
        }
    },

    methods: {
        downloadFile(nome_arq) {
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
    },

    mounted() {
        axios.get('http://localhost:3000/api/documento/' + this.documento_id)
            .then(res => {
                this.documento = res.data;
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }
}
</script>

<template>
    <section>
        <div v-if="documento.titulo" class="document-container">
            <h2>{{ documento.titulo }}</h2>

            <div class="doc-info">
                <div class="info-group">
                    <strong>Tipo de Documento:</strong>
                    <p>{{ documento.tipo_documento }}</p>
                </div>

                <div class="info-group">
                    <strong>Autores:</strong>
                    <p>{{ documento.autores }}</p>
                </div>

                <div class="info-group">
                    <strong>Ano:</strong>
                    <p>{{ documento.ano }}</p>
                </div>

                <div class="info-group">
                    <strong>Data de Submissão:</strong>
                    <p>{{ new Date(documento.data_criacao).toLocaleDateString() }}</p>
                </div>

                <div class="info-group">
                    <strong>Descrição:</strong>
                    <p class="description">{{ documento.descricao }}</p>
                </div>
            </div>

            <div class="actions">
                <button @click="downloadFile(documento.nome_arq)" class="download-btn">Download do Documento</button>
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