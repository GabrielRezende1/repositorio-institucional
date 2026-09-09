<script setup>
import { getPoliticas } from '@/services/contentService'
import { useFileDownload } from '@/composables/useFileDownload'
import { useAsyncState } from '@/composables/useAsyncState'

const { data: politica, execute } = useAsyncState({})
const { downloadPolicy } = useFileDownload()

async function downloadFile(nome_arq) {
    await downloadPolicy(nome_arq)
}

execute(getPoliticas)
</script>

<template>
    <section class="page-section content-page">
        <h2 class="page-heading">Políticas</h2>
        <ul>
            <li v-for="key in politica" :key="key">
                <a href="#" @click.prevent="downloadFile(key.nome_arq)">{{ key.nome_arq }}</a>
            </li>
        </ul>
    </section>
</template>

<style scoped>
.content-page ul {
    list-style: none;
    padding: 0 var(--space-4);
}

.content-page li {
    margin: var(--space-4) 0;
    font-size: 1.1rem;
}
</style>