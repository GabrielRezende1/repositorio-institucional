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
    createAccount() {
      axios
      .post('http://localhost:3000/api/cadastro', {
        email: this.email,
        senha: this.senha
      })
      .then(response => {
        if (response.status == 200) {
            console.log('Usuário cadastrado!');
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  },

  components: {
  },
}
</script>

<template>
  <section>
    <form method="post">
      <label for="email">EMAIL:</label>
      <input type="text" id="nome" :value="email" placeholder="Insira seu e-mail..."/>

      <label for="senha">SENHA:</label>
      <input type="password" id="senha" :value="senha" placeholder="Crie sua senha..."/>

      <label for="senha2">CONFIRME SUA SENHA:</label>
      <input type="password" id="senha2" :value="senha" placeholder="Repita sua senha..."/>
      
      <input type="submit" value="CADASTRAR">
      <RouterLink to="/login" class="RouterLink">Já possui conta? Então faça Login</RouterLink>
    </form>
  </section>
</template>

<style scoped>
section {
  width: 100%;
  min-height: calc(100vh - 300px); /** 150px from headerPartial and footer */

  position: relative;
}

form {
  width: 600px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  font-size: 22px;
}

.RouterLink {
  font-weight: 600;

  display: block;
  text-align: center;
}

/** Media Queries
 */

 @media screen and (max-width: 800px) {
  form {
    width: 100%;
  }

  input[type=text], input[type=password] {
  width: 95%;

  font-size: 18px;
}

input[type=text]:focus, input[type=password]:focus {
  font-size: 20px;
}

input[type=submit] {
  width: 40%;

  font-size: 18px;
}

input[type=submit]:hover {
  font-size: 20px;
}
}

@media screen and (max-width: 600px) {
  label {
    display: block;
    text-align: center;
    padding: 0;
  }
}
</style>
