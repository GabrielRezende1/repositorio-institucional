<script>
import IconMenu from "./icons/IconMenu.vue";
import IconCart from "./icons/IconCart.vue";
import IconFavorites from "./icons/IconFavorites.vue";
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
    <div>
      <img :src="x" :alt="x"/> <!--v-bind attrs to database-->
    </div><!--logo-->

    <div>
      <form action="/busca" method="post">
        <input v-model="searchInput" type="text" placeholder="Busque aqui">
      </form>
    </div><!--search-bar-->

    <div>
      <img :src="x" alt="usuário"><!--add login img-->

      <a href="/login">Login</a>

      <a href="/cadastro">Cadastro</a>
    </div><!--login/sign-up button and later something else-->

    <div>
      <nav>
        <ul>
          <li><a href="/carrinho"><IconCart /></a></li>
          <li><a href="/favoritos"><IconFavorites /></a></li>
          <li>
            <IconMenu />
          </li>
        </ul>
      </nav>
    </div><!--additional buttons (cart, favorites, bars menu)-->
  </header>
</template>

<style scoped>

</style>