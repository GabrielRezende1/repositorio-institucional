<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/loginService'
import { useAuthStore } from '@/stores/authStore'
import { useAuthCheck } from '@/composables/useAuthCheck'

const router = useRouter()
const authStore = useAuthStore()
//Trying to access login page while already logged in redirects to home page
const authCheck = useAuthCheck()
authCheck.checkAuth()

const form = reactive({
    // use reactive() instead of ref() for object data
    email: '',
    senha: '',
    senhaErrada: ''
})

async function loginUser() {
    const result = await login(form.email, form.senha)
    if (!result.success) {
        form.senhaErrada = 'Usuário ou senha incorretos!'
        return
    }
    authStore.changeConnection()
    router.push('/')
}
</script>

<template>
    <section>
        <form action="" method="get" @submit.prevent="loginUser">
            <label for="email">E-MAIL:</label>
            <input type="text" id="email" v-model="form.email" placeholder="Insira seu e-mail..." />

            <label for="senha">SENHA:</label>
            <input
                type="password"
                id="senha"
                v-model="form.senha"
                placeholder="Insira sua senha..."
            />

            <input type="submit" value="LOGAR" />

            <span v-if="form.senhaErrada">{{ form.senhaErrada }}</span>
            <RouterLink to="/cadastro" class="RouterLink">
                Não possui conta? Então cadastre-se
            </RouterLink>
        </form>
    </section>
</template>

<style scoped>
section {
    width: 100%;
    min-height: calc(100vh - 300px);
    /** 150px from headerPartial and footer */

    position: relative;
}

form {
    width: 800px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

label {
    font-size: 16px;
    padding: 0 2rem;
    color: var(--black);
    font-weight: 600;
}

input[type='text'],
input[type='password'] {
    display: block;
    width: 85%;
    height: 48px;

    padding-left: 1rem;
    font-size: 20px;
    margin: 0.5rem auto 2rem auto;
    border-radius: 10px;
    outline: 0;
    border: 0;

    transition: 0.4s;
}

input[type='text']:focus,
input[type='password']:focus {
    font-size: 22px;
}

input[type='submit'] {
    display: block;
    width: 30%;
    height: 48px;

    font-size: 20px;
    font-weight: 600;
    margin: 0 auto 1rem auto;
    border-radius: 10px;
    border: 0;
    background-color: var(--yellow);
    color: var(--black);
    cursor: pointer;

    transition: 0.4s;
}

input[type='submit']:hover {
    background-color: var(--blue);
    color: white;
    font-size: 22px;
}

.RouterLink {
    font-weight: 600;

    display: block;
    text-align: center;
}

span {
    display: block;
    margin: 0 auto;
    width: fit-content;
    background-color: rgba(255, 0, 0, 0.3);
    border-radius: 5px;
    padding: 0 5px;

    animation-name: blinkSpan;
    animation-duration: 0.4s;
    animation-iteration-count: 3;
}

@keyframes blinkSpan {
    50% {
        background-color: red;
    }
}

/** Media Queries
 */

@media screen and (max-width: 800px) {
    form {
        width: 100%;
    }

    input[type='text'],
    input[type='password'] {
        width: 95%;

        font-size: 18px;
    }

    input[type='text']:focus,
    input[type='password']:focus {
        font-size: 20px;
    }

    input[type='submit'] {
        width: 40%;

        font-size: 18px;
    }

    input[type='submit']:hover {
        font-size: 20px;
    }
}

@media screen and (max-width: 600px) {
    label {
        display: block;
        text-align: center;
        padding: 0;
    }
}
</style>
