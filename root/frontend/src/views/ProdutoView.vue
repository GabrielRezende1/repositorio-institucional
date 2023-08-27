<script>
import axios from 'axios';
export default {
    data() {
        return {
            nome: '',
            sobrenome: '',
            empresa: '',
            cadastrado: false,
            getProducts: {}
        }
    },

    methods: {
        submit() {
            axios
            .post('http://localhost:3000/produto', {
                nome: this.nome,
                sobrenome: this.sobrenome,
                empresa: this.empresa
            })
            .then((response) => {
                if (response.status == 200) {
                    console.log('Produto cadastrado!');
                    this.cadastrado = true;
                }
            })
            .catch((err) => {
                console.log('erro: ');
                console.log(err);
            })
        },

        getAllProducts() {
            axios
            .get('http://localhost:3000/produto')
            .then((response) => {
                if (response.status == 200) {
                    console.log('Get Alcançado!');
                    this.getProducts = response;
                }
            })
            .catch((err) => {
                console.log('erro: ');
                console.log(err);
            })
        }
    }
}
</script>

<template>
    <main>
            <input  type="text" placeholder="Nome" v-model="nome" required> <br>
            <h4>{{ nome }}</h4>
            <input  type="text" placeholder="Sobrenome" v-model="sobrenome" required> <br>
            <h4>{{ sobrenome }}</h4>
            <input  type="text" placeholder="Empresa" v-model="empresa" required> <br>
            <h4>{{ empresa }}</h4>
            <button @click="submit()">Cadastrar!</button>
        <h1 v-if="cadastrado">Axios cadastrou!</h1>
    </main>

    <section>
        <button @click="getAllProducts()">Ver produtos!</button>

        <p>{{ getProducts }}</p>
    </section>
</template>

<style scoped>

</style>