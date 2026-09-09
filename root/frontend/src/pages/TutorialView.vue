<script setup>
import { getTutorial } from '@/services/contentService'
import { useFileDownload } from '@/composables/useFileDownload'
import { useAsyncState } from '@/composables/useAsyncState'

const { data: tutorial, execute } = useAsyncState({})
const { downloadTutorial } = useFileDownload()

async function downloadFile(nome_arq) {
    await downloadTutorial(nome_arq)
}

execute(getTutorial)
</script>

<template>
    <section class="page-section content-page">
        <h2 class="page-heading">Informações</h2>
        <p v-for="key in tutorial.text" :key="key">
            {{ key }}
        </p>
        <hr />
        <h2 class="page-heading">Tutoriais</h2>
        <ul>
            <li v-for="key in tutorial.tutorials" :key="key">
                <a href="#" @click.prevent="downloadFile(key.nome_arq)">{{ key.nome_arq }}</a>
            </li>
        </ul>
    </section>
</template>

<style scoped>
.content-page p,
.content-page li {
    padding: 0 var(--space-4);
    font-size: 1.1rem;
    text-align: justify;
}
</style>