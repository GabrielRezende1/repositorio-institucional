<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as homeService from '@/services/homeService'

const router = useRouter()
const searchInput = ref('')
const docType = ref([])

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
        </div><!--logo-->

        <div class="search-bar">
            <!--Search specific doc-->
            <form action="" method="get" @submit.prevent="search">
                <input v-model="searchInput" type="text" placeholder="Buscar documento..." />
                <input type="submit" value="Buscar Documento" />
            </form>
            <!--Search all docs-->
            <form action="" method="get" @submit.prevent="viewDocs">
                <input type="submit" value="Todos os Documentos">
            </form>
        </div><!--search-bar-->

        <nav class="categorias">
            <ul>
                <li>
                    <RouterLink to="/documento/tipo/artigo+de+evento" class="RouterLink">Artigo de Evento</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/artigo+de+periodico" class="RouterLink">Artigo de Periódico
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/capitulo+de+livro" class="RouterLink">Capítulo de Livro</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/dissertacao" class="RouterLink">Dissertação</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/livro" class="RouterLink">Livro</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/monografia" class="RouterLink">Monografia</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/tese" class="RouterLink">Tese</RouterLink>
                </li>
                <li>
                    <RouterLink to="/documento/tipo/tcc" class="RouterLink">Trabalho de
                        Conclusão de Curso</RouterLink>
                </li>
            </ul>
        </nav><!--categorias-->
    </div><!--container-->
</template>

<style scoped>
.container {
    max-width: 1280px;
    min-height: calc(100vh - 300px);
    /** 150px from headerPartial and footer */
    margin: 0 auto;
}

/* logo */
div.logo {
    width: 25%;
    padding: 2rem 1rem 0 1rem;
    margin: 0 auto;
}

div.logo>.RouterLink img {
    width: 100%;
}

div.logo>.RouterLink {
    background-color: transparent;
}

div.logo img {
    background-color: white;
    border-radius: 10%;
}

/* search-bar */
div.search-bar {
    width: 60%;
    margin: 10px auto;
}

div.search-bar form input[type=text] {
    width: 100%;
    line-height: 30px;
    font-size: 20px;
    border-radius: 10px;
    padding-left: 0.5rem;
    background-color: var(--light-blue);

    transition: 0.4s;
}

div.search-bar form input[type=text]:focus {
    background-color: white;
    font-size: 22px;
}

input[type=submit] {
    display: block;
    width: 250px;
    height: 48px;

    font-size: 20px;
    font-weight: 600;
    margin: 1rem auto 1rem auto;
    border-radius: 10px;
    border: 0;
    background-color: var(--yellow);
    color: var(--black);
    cursor: pointer;

    transition: 0.4s;
}

input[type=submit]:hover {
    background-color: var(--blue);
    color: white;
    font-size: 21px;
}

/* nav */
nav.categorias {
    list-style-type: none;
}

nav.categorias ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

nav.categorias ul li {
    display: inline-block;
    margin: 1px 1px;
    font-size: 16px;
    background-color: var(--yellow);
    border-radius: 3px;
}

nav ul li .RouterLink {
    padding: 2px 0.5rem;
    font-weight: bold;
}

nav ul li .RouterLink:hover {
    background-color: #cfd64a;
}

@media screen and (max-width: 600px) {
    div.search-bar {
        width: 90%;
    }

    input[type=submit] {
        width: 220px;
        height: 40px;

        font-size: 18px;
        margin: 0.5rem auto 0.5rem auto;
    }

    input[type=submit]:hover {
        background-color: var(--blue);
        color: white;
        font-size: 19px;
    }
}
</style>
