<script>
import axios from 'axios'
export default {
    data() {
        return {
            docs: [],
            pagination: {},
            showNextPage: true,
            showPrevPage: true
        }
    },

    methods: {
        //Lower clutter functions
        changeNxPage() {
            if (this.pagination.next_page_url) {
                this.showNextPage = true;
            } else {
                this.showNextPage = false;
            }
            if (this.pagination.prev_page_url) {
                this.showPrevPage = true;
            } else {
                this.showPrevPage = false;
            }
        },

        changePvPage() {
            if (this.pagination.prev_page_url) {
                this.showPrevPage = true;
            } else {
                this.showPrevPage = false;
            }
            if (this.pagination.next_page_url) {
                this.showNextPage = true;
            } else {
                this.showNextPage = false;
            }
        },
        //
        nextPage(page) {
            if (this.pagination.next_page_url) {
                axios.get('http://localhost:3000/api/documento/tipo/'
                + this.$route.params.tipo
                + '?page='
                + page)
                .then(res => {
                    console.log(res.data);
                    this.docs = res.data.docRows;
                    this.pagination = res.data.pagination;
                    
                    this.changeNxPage();

                    this.$router.push(
                        '/documento/tipo/'
                        + this.$route.params.tipo
                        + '?page='
                        + page
                    );
                })
                .catch(err => {
                    console.log(err.response.data);
                });
            }
        },

        prevPage(page) {
            if (this.pagination.prev_page_url) {
                axios.get('http://localhost:3000/api/documento/tipo/'
                + this.$route.params.tipo
                + '?page='
                + page)
                .then(res => {
                    console.log(res.data);
                    this.docs = res.data.docRows;
                    this.pagination = res.data.pagination;
                    
                    this.changePvPage();
                    
                    this.$router.push(
                        '/documento/tipo/'
                        + this.$route.params.tipo
                        + '?page='
                        + page
                    );
                })
                .catch(err => {
                    console.log(err.response.data);
                });
            }
        },

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
                //Clear link and URL
                link.remove();
                URL.revokeObjectURL(link.href);
            })
            .catch(err => {
                console.log(err.response.data);
            });
        }
    },
    
    mounted() {
        axios.get('http://localhost:3000/api/documento/tipo/'
        + this.$route.params.tipo)
        .then(res => {
            this.docs = res.data.docRows;
            this.pagination = res.data.pagination;
            console.log(this.docs);
            console.log(this.pagination);
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
<!--             <colgroup>
                <col width="5%" />
                <col width="35%" />
                <col width="35%" />
                <col width="15%" />
                <col width="10%" />
            </colgroup> -->
            <thead>
                <tr>
                    <th>Data:</th>
                    <th>Título:</th>
                    <th>Autor:</th>
                    <th>Tipo:</th>
                    <th>Palavra-Chave:</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="doc in docs" :key="doc">
                    <td>{{ doc.data }}</td>
                    <td>{{ doc.nome_doc }}</td>
                    <td v-if="!doc.Discente">
                        {{ doc.Docente.nome }}
                    </td>
                    <td v-else>
                        {{ doc.Discente.nome }}
                    </td>
                    <td>{{ doc.Doc_tipo.tipo }}</td>
                    <td>
                        <a href="#" @click.prevent="docDownload(doc.id_documento, doc.nome_arq)">Baixar</a>
                        <a target="_blank" :href="'/documento/id/' + doc.id_documento">Visualizar</a>
                    </td>
                </tr><!-- v-for -->
            </tbody>
        </table>
    </section>

    <nav class="pages">
        <ul>
            <li><button v-show="showPrevPage" @click="prevPage(pagination.prev_page_url)">Página anterior</button></li>
            <li><button v-show="showNextPage" @click="nextPage(pagination.next_page_url)">Próxima página</button></li>
        </ul>
    </nav>

    <nav class="categorias">
      <ul>
        <li><a href="/documento/tipo/artigo+de+evento">Artigo de Evento</a></li>
        <li><a href="/documento/tipo/artigo+de+periodico">Artigo de Periódico</a></li>
        <li><a href="/documento/tipo/capitulo+de+livro">Capítulo de Livro</a></li>
        <li><a href="/documento/tipo/dissertacao">Dissertação</a></li>
        <li><a href="/documento/tipo/livro">Livro</a></li>
        <li><a href="/documento/tipo/monografia">Monografia</a></li>
        <li><a href="/documento/tipo/tese">Tese</a></li>
        <li><a href="/documento/tipo/trabalho+de+conclusao+de+curso">Trabalho de Conclusão de Curso</a></li>
      </ul>
    </nav><!--categorias-->
</template>

<style scoped>
section {
    width: 100%;
    margin: 2rem 0;
}
/**Table */
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
/** */
/**nav.pages */
nav.pages ul {
    list-style-type: none;
    text-align: center;
}

nav.pages ul li {
    display: inline-block;
    width: 100%;
}

nav.pages ul li button{
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

nav.pages ul li button:hover {
    background-color: var(--blue);
    color: white;
}
/** */
/* nav.categorias */
nav.categorias {
  list-style-type: none;
  background-color: var(--yellow);
}

nav.categorias ul li {
  display: inline-block;
  padding: 0 1rem;
  font-size: 16px;
}

nav ul li a {
  padding: 2px 0.5rem;
  font-weight: bold;
}

nav ul li a:hover {
  background-color: #cfd64a;
}
/** */
</style>