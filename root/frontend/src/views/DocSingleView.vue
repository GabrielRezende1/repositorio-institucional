<script>
import axios from 'axios';
export default {
    data() {
        return {
            data: {} //doc
        }
    },

    methods: {
        docDownload(id, nome_arq) {
            axios.get(`https://localhost:3000/documento/download/${id}/${nome_arq}`,
            {withCredentials: true, responseType: 'blob'})
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
        },
    },

    mounted() {
        axios.get('https://localhost:3000/documento/id/' + this.$route.params.id,
            {withCredentials: true})
            .then(res => {
                this.data = res.data;
                console.log(this.data);
            })
            .catch(err => {
                console.log(err.response.data);
            });
    }
}
</script>

<template>
<section>
<table>
    <tbody>
        <tr>
            <th>Tipo:</th>
            <th>Título:</th>
            <th>Autor:</th>
            <th v-if="data.isStudent">Orientador:</th>
            <th>Resumo:</th>
            <th>Palavras-Chave:</th>
            <th>Data:</th>
        </tr>

        <tr v-for="doc in data.doc" :key="doc">
            <td>{{ doc.Doc_tipo.tipo }}</td>
            <td>{{ doc.nome_doc }}</td>
            <td v-if="data.isStudent"> <!--Autor pode ser aluno ou professor-->
                {{ doc.Discente.nome }}
            </td>
            <td v-else>
                {{ doc.Docente.nome }}
            </td>
            <td v-if="data.isStudent">{{ doc.Docente.nome }}</td>
            <td>{{ doc.resumo }}</td>
            <td> <!--palavraChave-->
                <span v-for="docKeyword in data.docKeyword" :key="docKeyword">
                    {{ docKeyword.Palavra_chave.nome }};
                </span>
            </td>
            <td>{{ doc.data }}</td>
        </tr><!-- v-for -->
    </tbody>
    <td v-for="doc in data.doc" :key="doc">
        <a href="#" @click.prevent="docDownload(doc.id_documento, doc.nome_arq)">Baixar</a>
    </td>
</table>
</section>
</template>

<style scoped>
/**Table */
table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 95%;
    margin: 1rem auto;
}

table > td { /**link td */
    text-align: center;
}

table th {
    font-weight: 700;
    background-color: var(--yellow);
    text-align: left;
}

table tr { /**TRANSPOSE */
    display: block;
    float: left;
}

table tr:nth-child(odd) {
    width: 20%;
}

table tr:nth-child(even) {
  background-color: #D6EEEE;
  width: 80%;
}

table td, table th{
    display: block; /**TRANSPOSE */
    border-top: 2px solid var(--blue);
    font-size: 18px;
    padding: 5px;
}

table td a {
    display: inline-block;

    width: 30%;
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