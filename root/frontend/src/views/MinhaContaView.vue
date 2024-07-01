<script>
import axios from 'axios'
import MenuBar from '@/components/MenuBar.vue'
export default {
    data() {
        return {
            data: {}, // /GET /minha-conta
            data2: {}, // /POST /minha-conta,
            data3: {}, // /PUT /login
            nome: '',
            matricula: '', // Student
            curso: '', // Student
            idFuncional: '', //Teacher
            graduacao: '', //Teacher
            senha: '',
            novaSenha: '',
            confirmeSenha: '',
            senhaErrada: ''
        }
    },

    components: { MenuBar },
    
    methods: {
        postMinhaConta() {
            if (this.data.isStudent) {
                axios
                    .post('http://localhost:3000/api/minha-conta', {
                    matricula: this.matricula,
                    nome: this.nome,
                    curso: this.curso,
                    fk_id_usuario: this.data.userId
                })
                    .then((res) => {
                    console.log(res.data);
                    this.data2 = res.data;
                })
                    .catch((err) => {
                    console.log(err.response.data);
                    this.$router.push('/');
                });
            }
            else {
                axios
                    .post('http://localhost:3000/api/minha-conta', {
                    id_funcional: this.idFuncional,
                    nome: this.nome,
                    graduacao: this.graduacao,
                    fk_id_usuario: this.data.userId,
                })
                    .then((res) => {
                    console.log(res.data);
                    this.data2 = res.data;
                })
                    .catch((err) => {
                    console.log(err.response.data);
                    this.$router.push('/');
                });
            }
        },

        putMeuUsuario() {
            if (this.novaSenha == this.confirmeSenha) {
                axios
                    .put('http://localhost:3000/api/login',
                    {
                        senha: this.senha,
                        novaSenha: this.novaSenha,
                        confirmeSenha: this.confirmeSenha
                    })
                    .then(res => {
                        this.data3 = res.data;
                        console.log(this.data3);
                    })
                    .catch(err => {
                        console.log(err.response.data);
                        this.senhaErrada = "Senha ou nova Senha incorretos!";
                    })
            }
        }
    },
    beforeCreate() {
        //authToken
        axios
            .get('http://localhost:3000/api/minha-conta')
            .then((res) => {
            console.log(res.data);
            this.data = res.data;
            if (this.data.checkedUser) {
                const cUser = this.data.checkedUser;
                this.nome = cUser.nome; // Name is the same attr for both
                if (this.data.isStudent) {
                    this.matricula = cUser.matricula;
                    this.curso = cUser.curso;
                }
                else {
                    this.idFuncional = cUser.id_funcional;
                    this.graduacao = cUser.graduacao;
                }
            }
        })
            .catch((err) => {
            console.log(err.response.data);
            this.$router.push('/');
        });
    }
}
</script>

<template>
    <section>
        <MenuBar />
        <!-- Criação de docente/discente de acordo com o email -->
        <form v-if="data.isStudent" action="" method="post" @submit.prevent="postMinhaConta">
            <label for="matricula">Matrícula:</label>
            <input type="number" id="matricula" v-model="matricula"/>
            <label for="nome">Nome:</label>
            <input type="text" id="nome" v-model="nome"/>
            <label for="curso">Curso:</label>
            <select name="curso" id="curso" v-model="curso">
                <option value="GA">Gestão Ambiental</option>
                <option value="SI">Sistemas de Informação</option>
            </select>
            <input v-if="data.checkedUser" type="submit" value="Atualizar Discente"/>
            <input v-else type="submit" value="Criar Discente"/>
        </form>
        <form v-else action="" method="post" @submit.prevent="postMinhaConta">
            <label for="idFuncional">ID Funcional:</label>
            <input type="number" id="idFuncional" v-model="idFuncional"/>
            <label for="nome">Nome:</label>
            <input type="text" id="nome" v-model="nome"/>
            <label for="graduacao">Graduação: </label>
            <input type="text" id="graduacao" v-model="graduacao"/>
            <input v-if="data.checkedUser" type="submit" value="Atualizar Docente"/>
            <input v-else type="submit" value="Criar Docente"/>
        </form>
        <hr>
        <!--alteração do usuário-->
        <form action="" method="post" @submit.prevent="putMeuUsuario">
            <label for="email">Email:</label>
            <input type="text" id="email" v-model="data.email" disabled>
            <label for="senha">Senha:</label>
            <input type="password" id="senha" v-model="senha">
            <label for="novaSenha">Nova Senha:</label>
            <input type="password" id="novaSenha" v-model="novaSenha">
            <label for="confirmeSenha">Confirme a Senha:</label>
            <input type="password" id="confirmeSenha" v-model="confirmeSenha">
            <input type="submit" value="Atualizar Usuário">
        </form>
        <span v-if="senhaErrada">{{ senhaErrada }}</span>
    </section>
</template>

<style scoped>
section {
    width: 100%;
    margin: 2rem 0;
}

hr {
    color: var(--blue);
    margin: 1rem 0;
}

form {
  width: 800px;
  margin: 0 auto;
}

label {
  font-size: 18px;
  padding: 0 2rem;
  color: var(--black);
  font-weight: 600;
}

input[type=text], 
input[type=password],
input[type=number],
select {
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button { /* Remove Arrows/Spinners */
  -webkit-appearance: none;
  margin: 0;
}

input[type=number]:-moz-suppressed { /* Remove Arrows/Spinners */
    -moz-appearance: textfield;
}

input[type=text]:focus,
input[type=password]:focus,
input[type=number]:focus,
select:focus {
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

/** Media Queries
 */

 @media screen and (max-width: 800px) {
  form {
    width: 100%;
  }

  input[type=text], 
  input[type=password],
  input[type=number],
  select {
  width: 95%;

  font-size: 18px;
}

input[type=text]:focus,
input[type=password]:focus,
input[type=number]:focus,
select:focus {
  font-size: 20px;
}

input[type=submit] {
  width: 50%;

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
