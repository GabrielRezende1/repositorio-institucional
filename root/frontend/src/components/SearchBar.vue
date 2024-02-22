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
                axios.get('https://localhost:3000/?search=' + this.searchInput,
                {withCredentials: true})
                .then(res => {
                    console.log(res.data);
                    console.log(this.searchInput);
                    this.$router.push('/documento?search=' + this.searchInput);
                })
                .catch(err => {
                    console.log(err.response.data);
                });
            }
        }
    }
}
</script>

<template>
    <section>
        <div class="search-bar">
            <form action="" method="get" @submit.prevent="search">
                <input v-model="searchInput" type="text" placeholder="Busque aqui" />
                <input type="submit" value="Buscar" />
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
  border-radius: 2px;
  padding-left: 0.5rem;

  transition: 0.4s;
}

div.search-bar form input[type=text]:focus {
  font-size: 22px;
}

input[type=submit] {
  display: block;
  width: 30%;
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
</style>
