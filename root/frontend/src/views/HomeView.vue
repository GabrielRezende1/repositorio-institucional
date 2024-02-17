<script>
//TODO style frontend
import SearchView from '../components/SearchView.vue';
export default {
  data() {
    return {
      search: '',
      docType: []
    }
  },

  components: {
    SearchView
}
}
</script>

<template>
  <div class="container">
    <div class="logo">
            <a href="/"><img alt="logo do site" src="@/assets/logo.svg"/></a>
    </div><!--logo-->

    <div class="search">
      <SearchView />
    </div><!--search-->

    <nav class="categorias">
      <ul>
        <li><a href="">Artigo de Evento</a></li>
        <li><a href="">Artigo de Periódico</a></li>
        <li><a href="">Capítulo de Livro</a></li>
        <li><a href="">Dissertação</a></li>
        <li><a href="">Livro</a></li>
        <li><a href="">Monografia</a></li>
        <li><a href="">Tese</a></li>
        <li><a href="">Trabalho de Conclusão de Curso</a></li>
      </ul>
    </nav><!--categorias-->
  </div><!--container-->
</template>

<style scoped>

.container {
  max-width: 1280px;
  margin: 0 auto;
}

div.logo {
  width: 25%;
  padding: 2rem 1rem 0 1rem;
  margin: 0 auto;
}

div.logo > a img {
  width: 100%;
}

div.logo > a {
  background-color: transparent;
}
/* nav */
nav.categorias {
  list-style-type: none;
  background-color: var(--yellow);
}

nav.categorias ul li {
  display: inline-block;
  padding: 0 1rem;
  font-size: 16px;
}

nav ul li a {
  padding: 2px 0.5rem;
  font-weight: bold;
}

nav ul li a:hover {
  background-color: #cfd64a;
}
/** */

.flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  height: 100%; /* inherit from: container => header */
}

.produtos-single > button {
  /* width: 80%; */
  padding: 2px 1rem;
  font-size: 20px;
  
  border-radius: 5px;
  border: 1px solid var(--black);
  background-color: var(--yellow);

  transition: 0.4s;
}

.produtos-single > button:hover {
  background-color: var(--blue);
  color: white;
}
</style>
