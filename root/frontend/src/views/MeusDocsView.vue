<script>
import axios from 'axios'
import MenuBar from '../components/MenuBar.vue'
export default {
    data() {
        return {
            data: {}, //docs
            update: {}
        }
    },

    components: { MenuBar },

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

    beforeCreate() { //authToken
        axios
            .get('https://localhost:3000/minha-conta/meus-documentos', { withCredentials: true })
            .then((res) => {
                console.log(res.data)
                this.data = res.data
            })
            .catch((err) => {
                console.log(err.response.data);
                this.$router.push('/');
            })
    }
}
</script>

<template>
    <MenuBar />
    <section>
        <table>
            <colgroup>
                <col width="5%" />
                <col width="35%" />
                <col width="35%" />
                <col width="15%" />
                <col width="10%" />
            </colgroup>
            <thead>
                <tr>
                    <th>Data:</th>
                    <th>Título:</th>
                    <th>Orientador:</th>
                    <th>Tipo:</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="doc in data.docs" :key="doc">
                    <td>{{ doc.data }}</td>
                    <td>{{ doc.nome_doc }}</td>
                    <td>{{ doc.Docente.nome }}</td>
                    <td>{{ doc.Doc_tipo.tipo }}</td>
                    <td>
                        <a href="#" @click.prevent="docDownload(doc.id_documento, doc.nome_arq)">Baixar</a>
                        <a :href="'/minha-conta/meus-documentos/alterar-documento/' + doc.id_documento">Alterar</a>
                    </td>
                </tr><!-- v-for -->
            </tbody>
        </table>
    </section>
</template>

<style scoped>
section {
    width: 100%;
    margin: 2rem 0;
}

table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 95%;
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
    padding: 5px;
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
