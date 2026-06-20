<script setup>
import { ref, onMounted } from 'vue'
import { getTutorial } from '@/services/homeService'
import { useFileDownload } from '@/composables/useFileDownload'

const tutorial = ref({})
const { downloadTutorial } = useFileDownload()

async function downloadFile(nome_arq) {
    await downloadTutorial(nome_arq)
}

onMounted(async () => {
    const result = await getTutorial()
    if (!result.success) {
        console.log(result.error);
        return
    }
    tutorial.value = result.data;
    console.log(tutorial.value);
})
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