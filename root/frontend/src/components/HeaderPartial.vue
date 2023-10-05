<script>
import IconMenu from './icons/IconMenu.vue'
import IconCart from './icons/IconCart.vue';
import IconFavorites from "./icons/IconFavorites.vue";
import IconUser from './icons/IconUser.vue';
/* import { RouterLink } from 'vue-router'; */
export default {
  // Properties returned from data() become reactive state
  // and will be exposed on `this`.
  data() {
    return {
      imgLogo: '',
      searchInput: '',
      disconnected: true
    }
  },
  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event handlers in templates.
  methods: {
    
  },

  components: {
    IconMenu,
    IconCart,
    IconFavorites,
    IconUser
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
            <a href="/"><img alt="logo do site" src="@/assets/logo.svg"/></a>
          </div><!--logo-->

          <div class="search-bar">
            <form action="/busca" method="post">
              <input v-model="searchInput" type="text" placeholder="Busque aqui">
            </form>
          </div><!--search-bar-->

          <div class="user-account">
            <a href="/minha-conta"><IconUser /></a><!--add login img-->
            <div v-if="disconnected">
              <a href="/login">Login</a>
              <a href="/cadastro">Cadastro</a>
            </div><!--disconnected-->
          </div><!--v-if disconnected then don't show login/cadastro options-->

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
}

a {
  color: var(--yellow);
}

a:hover {
  background-color: var(--light-blue);
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

div.logo > a img {
  width: 80%;
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

div.user-account {
  text-align: center;
}

div.user-account > a:first-child {
  background-color: var(--light-blue);
  padding-top: 16px;
  border-radius: 50%;
}

div.user-account > a, div.user-account > div > a {
  padding: 0 0.5rem;
  font-weight: bold;
}

nav li {
  list-style-type: none;
  display: inline-block;
  
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-radius: 4px;
}

nav a:first-of-type {
  border: 0;
}

/* svg {
  width: 100%;
} */

@media screen and (max-width: 1200px) {
/**DOESN'T WORK? */
  /*   .logo {
    width: 10%;
  }

  .search-bar {
    width: 30%;
  }

  .user-account, .user-options {
    width: 30%;
  } */
}

</style>