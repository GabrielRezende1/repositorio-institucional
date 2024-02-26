<script>
//TODO style frontend
import axios from 'axios'
import MenuBar from '../components/MenuBar.vue'
export default {
    data() {
        return {
            data: {} //docs
        }
    },

    components: { MenuBar },

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
        <p>{{ data }}</p>
    </section>
</template>

<style scoped>

</style>
