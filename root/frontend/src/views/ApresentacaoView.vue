<script>
import axios from 'axios'
export default {
    data() {
        return {
            data: {}
        }
    },

    mounted() {
        axios.get("http://localhost:3000/api/apresentacao")
        .then(res => {
            this.data = res.data;
            console.log(this.data);
        })
        .catch(err => {
            console.log(err);
        })
    }
}
</script>

<template>
<section>
    <h2>Apresentação</h2>
    <p>{{ data.apresentacao }}</p>

    <hr>

    <h2>Missão</h2>
    <p>{{ data.missao }}</p>

    <hr>

    <h2>Objetivo</h2>
    <p>{{ data.objetivo }}</p>
</section>
</template>

<style scoped>
section {
    width: 100%;
    max-width: 1280px;
    min-height: calc(100vh - 300px); /** 150px from headerPartial and footer */
    margin: 0 auto;
}

p {
    font-size: 18px;
}

hr {
    color: var(--blue);
    margin: 1rem 0;
}
</style>