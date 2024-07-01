<script>
import axios from 'axios';
export default {
    data() {
        return {
            searchInput: ''
        }
    },

    methods: {
        search() {
            if (this.searchInput) {
                axios.get('http://localhost:3000/api/?search=' + this.searchInput)
                .then(res => {
                    console.log(res.data);
                    console.log(this.searchInput);
                    this.$router.push('/documento?search=' + this.searchInput);
                })
                .catch(err => {
                    console.log(err.response.data);
                });
            }
        },

        viewDocs() {
            axios.get('http://localhost:3000/api/documento')
                .then(res => {
                    console.log('todos os documentos')
                    console.log(res.data);
                    this.$router.push('/documento');
                })
                .catch(err => {
                    console.log(err.response.data);
                });
        }
    }
}
</script>

<template>
    <section>
        <div class="search-bar">
            <!--Search specific doc-->
            <form action="" method="get" @submit.prevent="search">
                <input v-model="searchInput" type="text" placeholder="Buscar documento..." />
                <input type="submit" value="Buscar" />
            </form>
            <!--Search all docs-->
            <form action="" method="get" @submit.prevent="viewDocs">
                <input type="submit" value="Ver Documentos">
            </form>
        </div><!--search-bar-->
    </section>
</template>

<style scoped>
div.search-bar {
  width: 60%;
  margin: 10px auto;
}

div.search-bar form input[type=text] {
  width: 100%;
  line-height: 30px;
  font-size: 20px;
  border-radius: 10px;
  padding-left: 0.5rem;
  background-color: var(--light-blue);

  transition: 0.4s;
}

div.search-bar form input[type=text]:focus {
    background-color: white;
  font-size: 22px;
}

input[type=submit] {
  display: block;
  width: 190px;
  height: 48px;

  font-size: 20px;
  font-weight: 600;
  margin: 1rem auto 1rem auto;
  border-radius: 10px;
  border: 0;
  background-color: var(--yellow);
  color: var(--black);
  cursor: pointer;

  transition: 0.4s;
}

input[type=submit]:hover {
  background-color: var(--blue);
  color: white;
  font-size: 21px;
}

/** Media Queries
 */

@media screen and (max-width: 600px) {
div.search-bar {
  width: 90%;
}

input[type=submit] {
  width: 160px;
  height: 40px;

  font-size: 18px;
  margin: 0.5rem auto 0.5rem auto;
}
} 

</style>
