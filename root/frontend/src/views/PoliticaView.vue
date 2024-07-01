<script>
import axios from 'axios'

export default {
    data() {
        return {
            politica: {}
        }
    },

    methods: {
        downloadFile(nome_arq) {
            axios.get('http://localhost:3000/api/politicas/' + nome_arq,
            {responseType: 'blob'})
            .then(res => {
                const link = document.createElement('a');
                console.log(link);
                link.href = window.URL.createObjectURL(
                    new Blob([res.data], {type: 'application/pdf'})
                );
                document.body.appendChild(link);
                link.setAttribute('download', nome_arq);
                link.click();
                //Clear link ans URL
                link.remove();
                URL.revokeObjectURL(link.href);
            })
            .catch(err => {
                console.log(err.response.data);
            });
        }
    },

    mounted() {
        axios.get('http://localhost:3000/api/politicas')
        .then(res => {
            this.politica = res.data;
            console.log(this.politica);
        })
        .catch(err => {
            console.log(err);
        })
    }
}
</script>

<template>
<section>    
    <h2>Políticas</h2>
    <ul>
        <li v-for="key in politica.politicas" :key="key">
            <a href="#" @click.prevent="downloadFile(key.nome_arq)">{{ key.nome_arq }}</a>
        </li>
    </ul>
</section>
</template>

<style scoped>

section {
    width: 100%;
    max-width: 1280px;
    min-height: calc(100vh - 300px); /** 150px from headerPartial and footer */
    margin: 0 auto;
}

h2 {
    padding: 0 1rem;
}

section > h2:first-child {
    margin: 1rem 0;
}

ul {
    padding: 0 1rem;
    list-style-type: none;
}

ul li {
    margin: 1rem 0;
    font-size: 18px;
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