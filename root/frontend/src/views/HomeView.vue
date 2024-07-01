<script>
import SearchBar from '@/components/SearchBar.vue';
export default {
  data() {
    return {
      search: '',
      docType: []
    }
  },

  components: {
    SearchBar
}
}
</script>

<template>
  <div class="container">
    <div class="logo">
            <RouterLink to="/" class="RouterLink"><img alt="logo do site" src="@/assets/faeterj-prc-logo.png"/></RouterLink>
    </div><!--logo-->

    <SearchBar />

    <nav class="categorias">
      <ul>
        <li><RouterLink to="/documento/tipo/artigo+de+evento" class="RouterLink">Artigo de Evento</RouterLink></li>
        <li><RouterLink to="/documento/tipo/artigo+de+periodico" class="RouterLink">Artigo de Periódico</RouterLink></li>
        <li><RouterLink to="/documento/tipo/capitulo+de+livro" class="RouterLink">Capítulo de Livro</RouterLink></li>
        <li><RouterLink to="/documento/tipo/dissertacao" class="RouterLink">Dissertação</RouterLink></li>
        <li><RouterLink to="/documento/tipo/livro" class="RouterLink">Livro</RouterLink></li>
        <li><RouterLink to="/documento/tipo/monografia" class="RouterLink">Monografia</RouterLink></li>
        <li><RouterLink to="/documento/tipo/tese" class="RouterLink">Tese</RouterLink></li>
        <li><RouterLink to="/documento/tipo/trabalho+de+conclusao+de+curso" class="RouterLink">Trabalho de Conclusão de Curso</RouterLink></li>
      </ul>
    </nav><!--categorias-->
  </div><!--container-->
</template>

<style scoped>

.container {
  max-width: 1280px;
  min-height: calc(100vh - 300px); /** 150px from headerPartial and footer */
  margin: 0 auto;
}

div.logo {
  width: 25%;
  padding: 2rem 1rem 0 1rem;
  margin: 0 auto;
}

div.logo > .RouterLink img {
  width: 100%;
}

div.logo > .RouterLink {
  background-color: transparent;
}

div.logo img {
  background-color: white;
  border-radius: 10%;
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

</style>
