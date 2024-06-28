<script>
//TODO user-account doesn't change when pushing to '/' from /login
import axios from 'axios';
import IconUser from '@/components/icons/IconUser.vue';
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
      axios.delete('http://localhost:3000/api/logout')
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
  // of RouterLink component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
      //authToken
      axios
      .get('http://localhost:3000/api/login')
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
            <RouterLink to="/" class="RouterLink"><img alt="logo do site" src="@/assets/faeterj-prc-logo.png"/></RouterLink>
          </div><!--logo-->

          <div class="general-opt">
            <nav>
              <ul>
                <li><RouterLink to="/apresentacao" class="RouterLink">Apresentação</RouterLink></li>
                <li><RouterLink to="/faq" class="RouterLink">FAQ</RouterLink></li>
                <li><RouterLink to="/politicas" class="RouterLink">Política</RouterLink></li>
                <li><RouterLink to="/tutorial" class="RouterLink">Tutorial</RouterLink></li>
              </ul>
            </nav>
          </div><!--general-opt-->

          <div class="user-account">
            <div v-if="disconnected">
              <RouterLink to="/login" class="RouterLink">Login</RouterLink>
              <RouterLink to="/cadastro" class="RouterLink">Cadastro</RouterLink>
            </div><!--disconnected-->
            <div v-else>
              <RouterLink to="/minha-conta" class="RouterLink icon-user"><IconUser /></RouterLink><!--add login img-->
              <RouterLink to="/minha-conta" class="RouterLink">Conta</RouterLink><!--add login img-->
              <RouterLink to="/" @click.prevent="logout()" class="RouterLink">Logout</RouterLink>
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

.RouterLink {
  color: var(--yellow);
  margin: 2px 5px;
  border-radius: 4px;
}

.RouterLink:hover {
  background-color: var(--light-blue);
}

div.logo > .RouterLink:hover { /* Logo img */
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

div.logo > .RouterLink img {
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

div.user-account > .RouterLink, div.user-account > div > .RouterLink {
  padding: 0 0.5rem;
  font-weight: bold;
}

nav li {
  list-style-type: none;
  display: inline-block;
}

nav .RouterLink {
  display: inline-block;
  padding: 0 1rem;
}

</style>