<script>
import axios from 'axios'

export default {
    data() {
        return {
            tutorial: {}
        }
    },

    methods: {
        downloadFile(nome_arq) {
            axios.get('http://localhost:3000/api/tutorial/documentos/' + nome_arq,
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
        axios.get('http://localhost:3000/api/tutorial')
        .then(res => {
            this.tutorial = res.data;
            console.log(this.tutorial);
        })
        .catch(err => {
            console.log(err);
        })
    }
}
</script>

<template>
<section>
    <h2>Informações</h2>
    <p v-for="key in tutorial.text" :key="key">
        {{ key }}
    </p>
    <hr/>
    <h2>Tutoriais</h2>
    <ul>
        <li v-for="key in tutorial.tutorials" :key="key">
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
    list-style-type: none;
}

ul li {
    margin: 1rem 0;
}

p, li {
    padding: 0 1rem;
    font-size: 18px;
    text-align: justify;
}

hr {
    color: var(--blue);
    margin: 1rem 0;
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