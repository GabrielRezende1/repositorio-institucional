<script>
import IconMySQL from "./icons/IconMySQL.vue";
import IconExpress from "./icons/IconExpress.vue";
import IconVue from "./icons/IconVue.vue";
import IconNode from "./icons/IconNode.vue";
import IconArrowUp from "./icons/IconArrowUp.vue";
export default {
  // Properties returned from data() become reactive state
  // and will be exposed on `this`.
  data() {
    return {
      
    }
  },
  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event handlers in templates.
  methods: {
    goBackUp() {

    }
  },

  components: {
    IconMySQL,
    IconExpress,
    IconVue,
    IconNode,
    IconArrowUp
  },
  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {

  }
}
</script>

<template>
  <footer>
    <p>Feito com</p>

    <nav>
      <!--Tecnologias usadas, telefone, email, voltar para cima-->
      <ul>
        <li><a href="https://www.mysql.com/" target="_blank"><IconMySQL /></a></li>
        <li><a href="https://expressjs.com/" target="_blank"><IconExpress /></a></li>
        <li><a href="https://vuejs.org/" target="_blank"><IconVue /></a></li>
        <li><a href="https://nodejs.org/en" target="_blank"><IconNode /></a></li>
      </ul>
    </nav>

    <p>Todos os direitos reservados© - 2023</p>
    
    <a href="#"><IconArrowUp /></a>
  </footer>
</template>

<style scoped>
  footer {
    height: 150px;
    color: var(--light-blue);
    text-align: center;
    background-color: var(--blue);

    position: relative;
  }

  p:first-of-type {
    padding-top: 5px;
  }

  nav ul {
    list-style-type: none;
  }

  nav ul li {
    display: inline-block;
    padding: 1rem 1rem;
  }

  footer nav li > a {
    background-color: transparent;
  }

  footer > a {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>