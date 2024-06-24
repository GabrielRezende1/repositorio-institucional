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
            axios.get(`http://localhost:3000/api/documento/download/${id}/${nome_arq}`,
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

    beforeCreate() { //authToken
        axios
            .get('http://localhost:3000/api/minha-conta/meus-documentos')
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
        <table v-if="data.email == 'Admin'">
            <colgroup>
                <col width="5%" />
                <col width="10%" />
                <col width="40%" />
                <col width="35%" />
                <col width="10%" />
            </colgroup>
            <thead>
                <tr>
                    <th>ID:</th>
                    <th>Data:</th>
                    <th>Título:</th>
                    <th>Tipo:</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="doc in data.docs" :key="doc">
                    <td>{{ doc.id_documento }}</td>
                    <td>{{ doc.data }}</td>
                    <td>{{ doc.nome_doc }}</td>
                    <td>{{ doc.Doc_tipo.tipo }}</td>
                    <td>
                        <a href="#" @click.prevent="docDownload(doc.id_documento, doc.nome_arq)">Baixar</a>
                        <RouterLink :to="'/minha-conta/meus-documentos/alterar-documento/' + doc.id_documento" class="RouterLink">Alterar</RouterLink>
                        <RouterLink :to="'/documento/id/' + doc.id_documento" class="RouterLink">Visualizar</RouterLink>
                    </td>
                </tr><!-- v-for -->
            </tbody><!--Admin-->
        </table><!--Admin-->

        <table v-else-if="data.isStudent">
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
                        <RouterLink :to="'/minha-conta/meus-documentos/alterar-documento/' + doc.id_documento" class="RouterLink">Alterar</RouterLink>
                        <RouterLink :to="'/documento/id/' + doc.id_documento" class="RouterLink">Visualizar</RouterLink>
                    </td>
                </tr><!-- v-for -->
            </tbody>
        </table><!--Discente-->

        <table v-else>
            <colgroup>
                <col width="10%" />
                <col width="65%" />
                <col width="15%" />
                <col width="10%" />
            </colgroup>
            <thead>
                <tr>
                    <th>Data:</th>
                    <th>Título:</th>
                    <th>Tipo:</th>
                    <th></th>
                </tr>
            </thead>
            <tbody >
                <tr v-for="doc in data.docs" :key="doc">
                    <td>{{ doc.data }}</td>
                    <td>{{ doc.nome_doc }}</td>
                    <td>{{ doc.Doc_tipo.tipo }}</td>
                    <td>
                        <a href="#" @click.prevent="docDownload(doc.id_documento, doc.nome_arq)">Baixar</a>
                        <RouterLink :to="'/minha-conta/meus-documentos/alterar-documento/' + doc.id_documento" class="RouterLink">Alterar</RouterLink>
                        <RouterLink :to="'/documento/id/' + doc.id_documento" class="RouterLink">Visualizar</RouterLink>
                    </td>
                </tr><!-- v-for -->
            </tbody>
        </table><!--Docente-->
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

table td a, table td .RouterLink {
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

table td a:hover, table td .RouterLink:hover {
    background-color: var(--blue);
  color: white;
}
</style>
