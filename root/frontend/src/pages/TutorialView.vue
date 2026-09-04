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
    <section>
        <h2>Informações</h2>
        <p v-for="key in tutorial.text" :key="key">
            {{ key }}
        </p>
        <hr />
        <h2>Tutoriais</h2>
        <ul>
            <li v-for="key in tutorial.tutorials" :key="key">
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
    list-style-type: none;
}

ul li {
    margin: 1rem 0;
}

p,
li {
    padding: 0 1rem;
    font-size: 18px;
    text-align: justify;
}

hr {
    color: var(--blue);
    margin: 1rem 0;
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