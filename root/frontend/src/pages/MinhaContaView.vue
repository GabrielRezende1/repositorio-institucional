<script setup>
import { ref, onMounted } from 'vue'
import { getUserProfile, updateUserProfile } from '@/services/userService'
import MenuBar from '@/components/MenuBar.vue'

const dataUser = ref({})

async function updateUser() {
    const result = await updateUserProfile(dataUser.value.nome, dataUser.value.email)
    if (!result.success && !result.status == 200) {
        alert(result.error || "Erro ao atualizar dados");
        console.log(result.error);
        return
    }
    alert("Dados atualizados com sucesso!");
}

onMounted(async () => {
    const result = await getUserProfile()
    if (!result.success) {
        console.log(result.error);
        return
    }
    dataUser.value = result.data;
    console.log(result.data);
})
</script>

<template>
    <MenuBar />
    <section class="page-section">
        <h2 class="page-heading">Minha Conta</h2>
        <form action="" method="put" @submit.prevent="updateUser" class="page-form">
            <label for="nome">NOME:</label>
            <input type="text" id="nome" v-model="dataUser.nome" placeholder="Insira seu nome..." />

            <label for="email">E-MAIL:</label>
            <input type="text" id="email" v-model="dataUser.email" placeholder="Insira seu e-mail..." />

            <div class="form-actions">
                <input type="submit" value="ATUALIZAR DADOS" class="btn primary-btn" />
            </div>
        </form>
    </section>
</template>

<style scoped>
.page-form {
    max-width: 900px;
}
</style>