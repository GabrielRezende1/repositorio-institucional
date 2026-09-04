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
    <section>
        <h2>Políticas</h2>
        <ul>
            <li v-for="key in politica" :key="key">
                <a href="#" @click.prevent="downloadFile(key.nome_arq)">{{ key.nome_arq }}</a>
            </li>
        </ul>
    </section>
</template>

<style scoped>
section {
    width: 100%;
    max-width: 1280px;
    min-height: calc(100vh - 300px);
    /** 150px from headerPartial and footer */
    margin: 0 auto;
}

h2 {
    padding: 0 1rem;
}

section>h2:first-child {
    margin: 1rem 0;
}

ul {
    padding: 0 1rem;
    list-style-type: none;
}

ul li {
    margin: 1rem 0;
    font-size: 18px;
}

/** Media Queries
 */

@media screen and (max-width: 800px) {
    h2 {
        text-align: center;
        padding: 0;
    }
}
</style>