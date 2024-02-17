<script>
//TODO style frontend
import axios from 'axios';
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
        searchURL() {
            if (!this.$route.query.page) {
                axios.get('https://localhost:3000/documento?search='
                + this.$route.query.search + '&page=1',
                {withCredentials: true})
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

            axios.get('https://localhost:3000/documento?search='
            + this.$route.query.search + '&page=' + this.$route.query.page,
            {withCredentials: true})
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

        nextPage(page) {
            if (this.pagination.next_page_url) {
                axios.get('https://localhost:3000/documento?search='
                + this.$route.query.search + '&page=' + page,
                {withCredentials: true})
                .then(res => {
                    console.log(res.data);
                    this.docs = res.data.docRows;
                    this.pagination = res.data.pagination;
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
                axios.get('https://localhost:3000/documento?search='
                + this.$route.query.search + '&page=' + page,
                {withCredentials: true})
                .then(res => {
                    console.log(res.data);
                    this.docs = res.data.docRows;
                    this.pagination = res.data.pagination;

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
        }
        console.log(this.$route.fullPath);
    }
}
</script>

<template>
    <section>
        <h1>PÁGINA ALCANÇADA! DocView.vue</h1>
        <p>{{ docs }}</p> <br><br> <p>{{ pagination }}</p>
    </section>

    <nav>
        <ul>
            <li><button v-show="showPrevPage" @click="prevPage(pagination.prev_page_url)">Página anterior</button></li>
            <li><button v-show="showNextPage" @click="nextPage(pagination.next_page_url)">Próxima página</button></li>
        </ul>
    </nav>
</template>

<style>

</style>