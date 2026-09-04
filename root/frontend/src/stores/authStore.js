import { defineStore } from 'pinia'
import { ref } from 'vue'
import { checkLogin, login, logout } from '@/services/loginService'

export const useAuthStore = defineStore('auth', () => {
    const connected = ref(false)
    const checking = ref(false)
    const initialized = ref(false)
    let initializationPromise

    async function checkSession() {
        const result = await checkLogin()
        connected.value = result.success && Boolean(result.data)
        return result
    }

    async function initialize() {
        if (initialized.value) {
            return connected.value
        }

        if (!initializationPromise) {
            checking.value = true
            initializationPromise = checkSession()
                .then(() => connected.value)
                .finally(() => {
                    initialized.value = true
                    checking.value = false
                    initializationPromise = undefined
                })
        }

        return initializationPromise
    }

    async function loginUser(email, password) {
        const result = await login(email, password)
        if (result.success) {
            connected.value = true
            initialized.value = true
        }
        return result
    }

    async function logoutUser() {
        const result = await logout()
        if (result.success) {
            connected.value = false
            initialized.value = true
        }
        return result
    }

    return {
        connected,
        checking,
        initialized,
        checkSession,
        initialize,
        loginUser,
        logoutUser
    }
})
