import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const connected = ref(false)

    function changeConnection(bool) {
        if (!bool) {
            connected.value = true
            return
        }
        connected.value = false
        useRouter().push('/')
    }

    return { connected, changeConnection }
})
