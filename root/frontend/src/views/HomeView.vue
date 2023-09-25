<script>
//import { RouterLink } from 'vue-router';
export default {
  data() {
    
  },

  components: {
    //RouterLink
}
}
</script>

<template>
  <div class="container">
    <nav class="departamentos-nav">
      <ul>
        <li class="subdepartamentos-nav"><a href="">CATEGORIAS</a></li>
        <li><a href="">HARDWARE</a></li>
        <li><a href="">PERIFÉRICOS</a></li>
        <li><a href="">FERRAMENTAS</a></li>
      </ul>
    </nav>

    <section class="produtos-vitrine flex">
      
    </section><!--produtos-vitrine flex-->

    <section class="departamentos-section flex">

    </section><!--departamentos-section-->
  </div>
</template>

<style scoped>

.container {
  max-width: 1280px;
  margin: 0 auto;
}
/* nav */
nav.departamentos-nav {
  list-style-type: none;
  background-color: var(--yellow);
}

nav.departamentos-nav ul li {
  display: inline-block;
  padding: 0 1rem;
  font-size: 16px;
}

nav.departamentos-nav ul li.subdepartamentos-nav {
  background-color: #cfd64a;
}

nav ul li a {
  padding: 2px 0.5rem;
  font-weight: bold;
}

nav ul li a:hover {
  background-color: #cfd64a;
}
/** */

/* section produtos-vitrine */

/** */

/* section departamentos-visual */
</style>
