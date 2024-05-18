<script>
//TODO style frontend
import axios from 'axios';
export default {
    data() {
        return {
            docs: [],
            pagination: {},
            searchInput: '',
            showNextPage: true,
            showPrevPage: true
        }
    },

    methods: {
        viewAllDocs() {
            axios.get('http://localhost:3000/api/documento')
                .then(res => {
                    console.log(res.data);
                    this.docs = res.data.docRows;
                    this.pagination = res.data.pagination;
                    if (!this.pagination.next_page_url) this.showNextPage = false;
                    if (!this.pagination.prev_page_url) this.showPrevPage = false;
                })
                .catch(err => {
                    console.log(err.response.data);
                });
                return;
        },

        search() {
            if (this.searchInput) {
                axios.get('http://localhost:3000/api/documento/?search=' + this.searchInput)
                .then(res => {
                    console.log(res.data);
                    this.docs = res.data.docRows;
                    this.pagination = res.data.pagination;
                    if (!this.pagination.next_page_url) this.showNextPage = false;
                    if (!this.pagination.prev_page_url) this.showPrevPage = false;
                    console.log(this.searchInput);
                    this.$router.push('/documento?search=' + this.searchInput);
                })
                .catch(err => {
                    console.log(err.response.data);
                });
            }else {
              axios.get('http://localhost:3000/api/documento')
                .then(res => {
                    console.log(res.data);
                    this.docs = res.data.docRows;
                    this.pagination = res.data.pagination;
                    if (!this.pagination.next_page_url) this.showNextPage = false;
                    if (!this.pagination.prev_page_url) this.showPrevPage = false;
                    this.$router.push('/documento');
                })
                .catch(err => {
                    console.log(err.response.data);
                });
                return;
            }
        },

        searchURL() {
            if (!this.$route.query.page) {
                axios.get('http://localhost:3000/api/documento?search='
                + this.$route.query.search + '&page=1')
                .then(res => {
                    console.log(res.data);
                    this.docs = res.data.docRows;
                    this.pagination = res.data.pagination;
                    if (!this.pagination.next_page_url) this.showNextPage = false;
                    if (!this.pagination.prev_page_url) this.showPrevPage = false;
                    
                })
                .catch(err => {
                    console.log(err.response.data);
                });
                return;
            }

            axios.get('http://localhost:3000/api/documento?search='
            + this.$route.query.search + '&page=' + this.$route.query.page)
            .then(res => {
                console.log(res.data);
                this.docs = res.data.docRows;
                this.pagination = res.data.pagination;
                if (!this.pagination.next_page_url) this.showNextPage = false;
                if (!this.pagination.prev_page_url) this.showPrevPage = false;
            })
            .catch(err => {
                console.log(err.response.data);
            });
        },
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
                if (!this.$route.query.search) {
                    axios.get('http://localhost:3000/api/documento?page='
                    + page)
                    .then(res => {
                        console.log(res.data);
                        this.docs = res.data.docRows;
                        this.pagination = res.data.pagination;
                        
                        this.changeNxPage();

                        this.$router.push('/documento?page=' + page);
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    });
                    return;
                }

                axios.get('http://localhost:3000/api/documento?search='
                + this.$route.query.search + '&page=' + page)
                .then(res => {
                    console.log(res.data);
                    this.docs = res.data.docRows;
                    this.pagination = res.data.pagination;

                    this.changeNxPage();

                    this.$router.push(
                        '/documento?search='
                        + this.$route.query.search
                        + '&page=' + page
                    );
                })
                .catch(err => {
                    console.log(err.response.data);
                });
            }
        },

        prevPage(page) {
            if (this.pagination.prev_page_url) {
                if (!this.$route.query.search) {
                    axios.get('http://localhost:3000/api/documento?page='
                    + page)
                    .then(res => {
                        console.log(res.data);
                        this.docs = res.data.docRows;
                        this.pagination = res.data.pagination;
                        
                        this.changePvPage();
                        
                        this.$router.push('/documento?page=' + page);
                    })
                    .catch(err => {
                        console.log(err.response.data);
                    });
                    return;
                }

                axios.get('http://localhost:3000/api/documento?search='
                + this.$route.query.search + '&page=' + page)
                .then(res => {
                    console.log(res.data);
                    this.docs = res.data.docRows;
                    this.pagination = res.data.pagination;

                    this.changePvPage();

                    this.$router.push(
                        '/documento?search='
                        + this.$route.query.search
                        + '&page=' + page
                    );
                })
                .catch(err => {
                    console.log(err.response.data);
                });
            }
        }
    },
    
    mounted() {
        if (this.$route.query.search) {
            this.searchURL(); // For URL to work
        }else {
            this.viewAllDocs();
        }
    }
}
</script>

<template>
    <div class="search-bar">
        <form action="" method="get" @submit.prevent="search">
            <input v-model="searchInput" type="text" placeholder="Buscar documentos">
            <input hidden type="submit" />
        </form>
    </div><!--search-bar-->

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
                    <th>Autor:</th>
                    <th>Tipo:</th>
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
                        <RouterLink target="_blank" :to="'/documento/id/' + doc.id_documento" class="RouterLink">Visualizar</RouterLink>
                    </td>
                </tr><!-- v-for -->
            </tbody>
        </table>
    </section>

    <nav>
        <ul>
            <li><button v-show="showPrevPage" @click="prevPage(pagination.prev_page_url)">Página anterior</button></li>
            <li><button v-show="showNextPage" @click="nextPage(pagination.next_page_url)">Próxima página</button></li>
        </ul>
    </nav>
</template>

<style scoped>
div.search-bar {
  width: 50%;
  margin: 10px auto;
}

div.search-bar form input[type=text] {
  width: 100%;
  line-height: 30px;
  font-size: 20px;
  border-radius: 2px;
  padding-left: 0.5rem;
  transition: 0.4s;
}

div.search-bar form input[type=text]:focus {
  font-size: 21px;
}

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
/** */
/**nav */
nav ul {
    list-style-type: none;
    text-align: center;
}

nav ul li {
    display: inline-block;
    width: 100%;
}

nav ul li button{
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

nav ul li button:hover {
    background-color: var(--blue);
    color: white;
}
</style>