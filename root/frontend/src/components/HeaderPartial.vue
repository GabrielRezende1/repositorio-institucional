<script>
import IconMenu from './icons/IconMenu.vue'
import IconCart from './icons/IconCart.vue';
import IconFavorites from "./icons/IconFavorites.vue";
/* import { RouterLink } from 'vue-router'; */
export default {
  // Properties returned from data() become reactive state
  // and will be exposed on `this`.
  data() {
    return {
      imgLogo: '',
      searchInput: ''
    }
  },
  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event handlers in templates.
  methods: {
    
  },

  components: {
    IconMenu,
    IconCart,
    IconFavorites
  },
  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
    
  }
}
</script>

<template>
  <header>
    <div class="container">

        <div class="flex"> 
          <div class="logo">
            <a href="/"><img alt="logo do site" src="@/assets/logo.svg" width="125" height="125" /></a>
          </div><!--logo-->

          <div class="search-bar">
            <form action="/busca" method="post">
              <input v-model="searchInput" type="text" placeholder="Busque aqui">
            </form>
          </div><!--search-bar-->

          <div class="user-account">
            <img :src="x" alt="foto do usuário"><!--add login img-->
            <a href="/login">Login</a>
            <a href="/cadastro">Cadastro</a>
          </div><!--user-account-->

          <div class="user-options">
            <nav>
              <ul>
                <li><a href="/carrinho"><IconCart /></a></li>
                <li><a href="/minha-conta/favoritos"><IconFavorites /></a></li>
                <li><a href="#"><IconMenu /></a></li>
              </ul>
            </nav>
          </div><!--user-options-->
        </div><!--flex-->

    </div><!--container-->
  </header>
</template>

<style scoped>

header {
  max-width: 100vw;
  height: 150px;
  padding: 0 2rem;
  background-color: var(--blue);
  color: var(--light-blue);
}

div:nth-child(1) > a:hover { /* Logo img */
  background-color: transparent;
}

div.container {
  max-width: 1280px;
  height: 100%; /* inherit from: header */
  margin: 0 auto;
}

.flex {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 100%; /* inherit from: container => header */
}

div.logo, div.search-bar, div.user-account, div.user-options {
  padding: 0 1rem 0 1rem;
}

div.logo {
  width: 15%;
}

div.search-bar {
  width: 45%;
}

div.search-bar form input[type=text] {
  width: 100%;
  line-height: 1.5;
  font-size: 20px;
  border-radius: 2px;
  padding-left: 1rem;
}

div.user-account, div.user-options {
  width: 20%;
}

nav li {
  list-style-type: none;
  display: inline-block;
  
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--yellow);
}

nav a:first-of-type {
  border: 0;
}

@media screen and (max-width: 1200px) {
  div.logo img {
    width: 100px;
    height: 100px;
  }
}

</style>