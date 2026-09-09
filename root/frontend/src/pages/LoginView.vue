<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
    // use reactive() instead of ref() for object data
    email: '',
    senha: '',
    senhaErrada: ''
})

async function loginUser() {
    const result = await authStore.loginUser(form.email, form.senha)
    if (!result.success) {
        form.senhaErrada = 'Usuário ou senha incorretos!'
        return
    }
    router.push('/')
}
</script>

<template>
    <section class="page-section auth-page">
        <form action="" method="get" @submit.prevent="loginUser" class="page-form auth-form">
            <label for="email">E-MAIL:</label>
            <input type="text" id="email" v-model="form.email" placeholder="Insira seu e-mail..." />

            <label for="senha">SENHA:</label>
            <input
                type="password"
                id="senha"
                v-model="form.senha"
                placeholder="Insira sua senha..."
            />

            <div class="form-actions">
                <input type="submit" value="LOGAR" class="btn primary-btn" />
            </div>

            <span v-if="form.senhaErrada" class="status-message error">{{ form.senhaErrada }}</span>
            <RouterLink to="/cadastro" class="RouterLink">
                Não possui conta? Então cadastre-se
            </RouterLink>
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

.auth-form .status-message.error {
    animation: blinkSpan 0.4s ease 3;
}

@keyframes blinkSpan {
    50% {
        background-color: var(--color-error-text);
        color: #fff;
    }
}
</style>
