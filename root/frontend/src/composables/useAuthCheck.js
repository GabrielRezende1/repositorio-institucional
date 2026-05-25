import { useRouter } from 'vue-router'
import { checkLogin } from '@/services/loginService'

/**
 * Checks if user is already authenticated and redirects accordingly
 * Used in components where the user have to be logged in
 */
export function useAuthCheck() {
    const router = useRouter()

    async function checkIn() {
        const result = await checkLogin()

        if (result.success && result.data)
            router.push('/')
    }

    async function checkOut() {
        const result = await checkLogin()

        if (!result.success)
            router.push('/')
    }

    return {
        checkIn,
        checkOut
    }
}
