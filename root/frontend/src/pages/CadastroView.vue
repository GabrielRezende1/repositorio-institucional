<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFormValidation } from '@/composables/useFormValidation'
import { registerUser } from '@/services/userService'

const router = useRouter()

const { formErrors, validatePasswordMatch, setError } = useFormValidation()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const type = ref('')

async function registerUserHandler() {
    if (!validatePasswordMatch(password.value, confirmPassword.value)) {
        return;
    }
    const result = await registerUser(name.value, email.value, password.value,confirmPassword.value, type.value)
    if (result.success && result.status == 201) {
        router.push("/login");
    } else {
        setError(result.error?.message || "Erro ao registrar usuário");
        console.log(result.error);
    }
}
</script>

<template>
    <section class="page-section auth-page">
        <form action="" method="post" @submit.prevent="registerUserHandler" class="page-form auth-form">
            <label for="name">NOME:</label>
            <input type="text" id="name" v-model="name" placeholder="Insira seu nome..." />

            <label for="email">E-MAIL:</label>
            <input type="text" id="email" v-model="email" placeholder="Insira seu e-mail..." />

            <label for="password">SENHA:</label>
            <input type="password" id="password" v-model="password" placeholder="Insira sua senha...">

            <label for="confirmPassword">CONFIRME A SENHA:</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Confirme sua senha...">

            <label for="type">TIPO DE USUÁRIO:</label>
            <select id="type" v-model="type">
                <option value="">Selecione uma opção</option>
                <option value="docente">Docente</option>
                <option value="discente">Discente</option>
            </select>

            <div class="form-actions">
                <input type="submit" value="REGISTRAR" class="btn primary-btn" />
            </div>

            <span v-if="formErrors" class="status-message error">{{ formErrors }}</span>
            <RouterLink to="/login" class="RouterLink">Já possui conta? Faça login</RouterLink>
        </form>
    </section>
</template>

<style scoped>
.auth-page {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
}

.auth-form {
    width: min(800px, 100%);
    position: relative;
    transform: none;
}

.auth-form .RouterLink {
    display: block;
    margin-top: 1rem;
    text-align: center;
    font-weight: 700;
}
</style>