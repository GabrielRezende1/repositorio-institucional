<script>
import axios from 'axios'
export default {
  data() {
    return {
      email: '',
      senha: ''
    }
  },

  methods: {
    logInUser() {
      axios
      .post('https://localhost:3000/login', {
        email: this.email,
        senha: this.senha
      }, { withCredentials: true })
      .then(response => {
        if(response.status == 200) {
          console.log('Usuário logado!');
        } else {
          console.log('Usuário ou senha incorretos!');
        }
      })
      .catch(err => {
        console.log('erro: ');
        console.log(err);
      })
    }
  },

  components: {
  }
}
</script>

<template>
  <section>
    <form action="" method="get">
      <label for="email">E-MAIL:</label>
      <input type="text" id="email" v-model="email" placeholder="Insira seu e-mail..."/>

      <label for="senha">SENHA:</label>
      <input type="password" id="senha" v-model="senha" placeholder="Insira seu e-mail...">

      <input type="submit" @click="logInUser()" value="LOGAR"/>
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
  width: 600px;
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
  font-size: 22px;
  margin: 0.5rem auto 2rem auto;
  border-radius: 10px;
  outline: 0;
  border: 0;

  transition: 0.4s;
}

input[type=text]:focus, input[type=password]:focus {
  font-size: 24px;
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
</style>
