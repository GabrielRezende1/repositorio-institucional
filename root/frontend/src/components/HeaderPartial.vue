<script>
//TODO user-account doesn't change when pushing to '/' from /login
import axios from 'axios';
import IconUser from './icons/IconUser.vue'
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
    logout() {
      axios.delete('https://localhost:3000/logout', {withCredentials: true})
      .then(res => {
        console.log(res.data);
        this.disconnected = true;
        this.$router.push('/');
      })
      .catch(err => {
        console.log(err.response.data)
      })
    }
  },
  components: {
    IconUser
  },
  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
      //authToken
      axios
      .get('https://localhost:3000/login', { withCredentials: true })
      .then((res) => {
          console.log(res.data);
          console.log('você está logado!');
          this.disconnected = false;
      })
      .catch((err) => {
          console.log(err.response.data);
          this.disconnected = true;
      })
  }
}
</script>

<template>
  <header>
    <div class="container">

        <div class="flex">
          <div class="logo">
            <a href="/"><img alt="logo do site" src="@/assets/faeterj-prc-logo.png"/></a>
          </div><!--logo-->

          <div class="general-opt">
            <nav>
              <ul>
                <li><a href="/apresentacao">Apresentação</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/politicas">Política</a></li>
                <li><a href="/tutorial">Tutorial</a></li>
              </ul>
            </nav>
          </div><!--general-opt-->

          <div class="user-account">
            <div v-if="disconnected">
              <a href="/login">Login</a>
              <a href="/cadastro">Cadastro</a>
            </div><!--disconnected-->
            <div v-else>
              <a href="/minha-conta" class="icon-user"><IconUser /></a>
              <a href="/minha-conta">Conta</a><!--add login img-->
              <a href="/" @click.prevent="logout()">Logout</a>
            </div>
          </div><!--user-account-->

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
  margin: 2px 5px;
  border-radius: 4px;
}

a:hover {
  background-color: var(--light-blue);
}

div.logo > a:hover { /* Logo img */
  background-color: transparent;
}

div.logo img {
  background-color: white;
  border-radius: 10%;
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

div.logo, div.general-opt, div.search-bar, div.user-account {
  padding: 0 1rem 0 1rem;
}

div.logo {
  width: 15%;
}

div.logo > a img {
  width: 80%;
}

div.user-account, div.general-opt {
  width: 20%;
}

div.user-account {
  text-align: center;
}

div.user-account .icon-user:first-child {
  background-color: var(--light-blue);

  width: 60px;
  border-radius: 50%;

  display: block;
  position: relative;
  transform: translateX(-50%);
  left: 50%;
}

div.user-account .icon-user:first-child:hover {
  background-color: greenyellow;
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
}

</style>