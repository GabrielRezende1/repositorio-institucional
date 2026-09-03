import apiClient, { getApiError } from '@/api/axios'

export async function login(email, password) {
    try {
        const res = await apiClient.post(
            '/login',
            {
                email: email,
                senha: password
            },
        )
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

export async function checkLogin() {
    try {
        const res = await apiClient.get('/login')
        return { success: true, data: res.data.token, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

export async function logout() {
    try {
        const res = await apiClient.delete('/logout')
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}
