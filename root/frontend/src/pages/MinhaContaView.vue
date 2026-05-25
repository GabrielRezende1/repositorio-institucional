<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useAuthCheck } from '@/composables/useAuthCheck'
import MenuBar from '@/components/MenuBar.vue'

const auth = useAuthCheck()
auth.checkOut()

const dataUser = ref({})

function updateUser() {
    axios.put('http://localhost:3000/api/minha-conta', {
        nome: dataUser.value.nome,
        email: dataUser.value.email
    }, { withCredentials: true })
        .then(res => {
            if (res.status == 200)
                alert("Dados atualizados com sucesso!");
        })
        .catch(err => {
            alert(err.response.data);
            console.log(err.response.data);
        });
}

onMounted(() => {
    axios.get('http://localhost:3000/api/minha-conta', { withCredentials: true })
        .then(res => {
            dataUser.value = res.data;
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        })
})
</script>

<template>
    <MenuBar />
    <section>
        <h2>Minha Conta</h2>
        <form action="" method="put" @submit.prevent="updateUser">
            <label for="nome">NOME:</label>
            <input type="text" id="nome" v-model="dataUser.nome" placeholder="Insira seu nome..." />

            <label for="email">E-MAIL:</label>
            <input type="text" id="email" v-model="dataUser.email" placeholder="Insira seu e-mail..." />

            <input type="submit" value="ATUALIZAR DADOS" />
        </form>
    </section>
</template>

<style scoped>
section {
    width: 100%;
    max-width: 1280px;
    min-height: calc(100vh - 300px);
    /** 150px from headerPartial and footer */
    margin: 0 auto;
}

h2 {
    padding: 2rem 1rem 0 1rem;
    margin: 0;
}

form {
    width: 100%;
    padding: 1rem;
}

label {
    font-size: 16px;
    padding: 0 1rem;
    color: var(--black);
    font-weight: 600;
}

input[type=text] {
    display: block;
    width: 100%;
    height: 48px;

    padding-left: 1rem;
    font-size: 20px;
    margin: 0.5rem 0 2rem 0;
    border-radius: 10px;
    outline: 0;
    border: 0;
    box-sizing: border-box;

    transition: 0.4s;
}

input[type=text]:focus {
    font-size: 22px;
}

input[type=submit] {
    display: block;
    width: 250px;
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

/** Media Queries
 */

@media screen and (max-width: 800px) {
    h2 {
        text-align: center;
        padding: 0;
    }
}
</style>