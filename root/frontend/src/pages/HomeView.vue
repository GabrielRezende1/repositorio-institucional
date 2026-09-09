<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as homeService from '@/services/homeService'

const router = useRouter()
const searchInput = ref('')

async function search() {
    if (!searchInput.value) {
        return
    }
    const result = await homeService.searchDocuments(searchInput.value)
    if (!result.success) {
        console.log(result.error);
        return
    }
    console.log(result.data);
    console.log(searchInput.value);
    router.push('/documento?search=' + searchInput.value);
}

async function viewDocs() {
    const result = await homeService.viewAllDocuments()
    if (!result.success) {
        console.log(result.error);
        return
    }
    console.log('todos os documentos')
    console.log(result.data);
    router.push('/documento');
}
</script>

<template>
    <div class="container">
        <div class="logo">
            <RouterLink to="/" class="RouterLink"><img alt="logo do site" src="@/assets/images/faeterj-prc-logo.png" />
            </RouterLink>
        </div>

        <div class="search-bar">
            <form action="" method="get" @submit.prevent="search">
                <input v-model="searchInput" type="text" placeholder="Buscar documento..." />
                <input type="submit" value="Buscar Documento" class="btn primary-btn" />
            </form>
            <form action="" method="get" @submit.prevent="viewDocs">
                <input type="submit" value="Todos os Documentos" class="btn primary-btn">
            </form>
        </div>

        <nav class="categorias">
            <ul>
                <li>
                    <RouterLink to="/documento/tipo/artigo+de+evento" class="btn category-link">Artigo de Evento</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/artigo+de+periodico" class="btn category-link">Artigo de Periódico</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/capitulo+de+livro" class="btn category-link">Capítulo de Livro</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/dissertacao" class="btn category-link">Dissertação</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/livro" class="btn category-link">Livro</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/monografia" class="btn category-link">Monografia</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/tese" class="btn category-link">Tese</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/tcc" class="btn category-link">Trabalho de Conclusão de Curso</RouterLink>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped>
.container {
    max-width: var(--max-page-width);
    min-height: calc(100vh - 300px);
    margin: 0 auto;
}

.logo {
    width: 25%;
    padding: 2rem 1rem 0;
    margin: 0 auto;
}

.logo > .RouterLink {
    background-color: transparent;
}

.logo img {
    background-color: white;
    border-radius: 10%;
}

.search-bar {
    width: 60%;
    margin: 10px auto;
}

.search-bar form {
    display: flex;
    flex-flow: column;
}

.search-bar form input[type='text'] {
    width: 100%;
    line-height: 30px;
    font-size: 1.2rem;
    border-radius: var(--radius-md);
    padding: 0.7rem 0.75rem;
    background-color: var(--color-secondary);
    border: 1px solid var(--color-border);
    transition: var(--transition-base);
}

.search-bar form input[type='text']:focus {
    background-color: white;
    box-shadow: var(--shadow-focus);
}

.search-bar form input[type='submit'] {
    margin: 10px auto;
}

nav.categorias {
    margin: 2rem 0;
    list-style-type: none;
}

nav.categorias ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 0.5rem;
    list-style: none;
}

nav.categorias li {
    display: inline-block;
}

.category-link {
    display: inline-flex;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    font-weight: 700;
    border-radius: var(--radius-sm);
}

@media screen and (max-width: 600px) {
    .search-bar {
        width: 90%;
    }
}
</style>
