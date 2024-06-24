<script>
import axios from 'axios';
export default {
    data() {
        return {
            data: {}
        }
    },

    mounted() {
        axios.get("http://localhost:3000/api/faq")
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
    <h2>Perguntas Frequentes</h2>
    <br><br><br>
    <table>
        <tbody>
            <tr v-for="doc in data" :key="doc">
                <td>{{ doc }}</td>
            </tr><!-- v-for -->
        </tbody>
    </table>
</section>
</template>

<style scoped>
section {
    width: 100%;
    max-width: 1280px;
    min-height: calc(100vh - 300px); /** 150px from headerPartial and footer */
    margin: 0 auto;
}

table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
    margin: 0 auto;
}

table th {
    font-weight: 700;
    background-color: var(--yellow);
    text-align: left;
}

table tr:nth-child(even) {
  background-color: #D6EEEE;
}

table td, table th{
    border-top: 2px solid var(--blue);
    font-size: 18px;
    padding: 10px;
}

table td a {
    display: inline-block;

    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    padding: 0.5rem;
    margin: 0 0 0.5rem 0;
    border-radius: 10px;
    background-color: var(--yellow);
    color: var(--black);
    cursor: pointer;

    transition: 0.4s;
}

table td a:hover {
    background-color: var(--blue);
    color: white;
}
</style>