<script>
import axios from 'axios'
export default {
  data() {
    return {
      email: '',
      senha: '',
      senhaErrada: ''
    }
  },

  methods: {
    logInUser() {
      axios.post('https://localhost:3000/login', {
        email: this.email,
        senha: this.senha
      }, { withCredentials: true })
      .then(res => {
        if(res.status == 200)
          this.$router.push("/");
      })
      .catch(err => {
        this.senhaErrada = "Usuário ou senha incorretos!";
        console.log(err.response.data);
      });
    }
  },
  //Trying to access login page while already logged in redirects to home page
  beforeCreate() {
    axios.get('https://localhost:3000/login', { withCredentials: true })
    .then(res => {
      console.log(res.data);
      if (res.data.token) this.$router.push("/");
    })
    .catch(err => {
      console.log(err.response.data);
    });
  }
}
</script>

<template>
  <section>
    <form action="" method="get" @submit.prevent="logInUser">
      <label for="email">E-MAIL:</label>
      <input type="text" id="email" v-model="email" placeholder="Insira seu e-mail..."/>

      <label for="senha">SENHA:</label>
      <input type="password" id="senha" v-model="senha" placeholder="Insira seu e-mail...">

      <input type="submit" value="LOGAR"/>
      
      <span v-if="senhaErrada">{{ senhaErrada }}</span>
      <a href="/cadastro">Não possui conta? Então cadastre-se</a>
    </form>
  </section>
</template>

<style scoped>
section {
  width: 100%;
  margin: 2rem 0;
}

form {
  width: 800px;
  margin: 0 auto;
}

label {
  font-size: 16px;
  padding: 0 2rem;
  color: var(--black);
  font-weight: 600;
}

input[type=text], input[type=password] {
  display: block;
  width: 85%;
  height: 48px;

  padding-left: 1rem;
  font-size: 20px;
  margin: 0.5rem auto 2rem auto;
  border-radius: 10px;
  outline: 0;
  border: 0;

  transition: 0.4s;
}

input[type=text]:focus, input[type=password]:focus {
  font-size: 22px;
}

input[type=submit] {
  display: block;
  width: 30%;
  height: 48px;

  font-size: 20px;
  font-weight: 600;
  margin: 0 auto 1rem auto;
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

a {
  font-weight: 600;

  display: block;
  text-align: center;
}

span {
  display: block;
  margin: 0 auto;
  width: fit-content;
  background-color: rgba(255, 0, 0, 0.3);
  border-radius: 5px;
  padding: 0 5px;
  
  animation-name: blinkSpan;
  animation-duration: 0.4s;
  animation-iteration-count: 3;
}

@keyframes blinkSpan {
  50% {
    background-color: red;
  }
}
</style>
