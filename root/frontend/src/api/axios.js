import axios from 'axios'

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true
})

export function getApiError(error) {
    return error.response?.data || {
        message: error.message || 'Erro de comunicação com o servidor'
    }
}

export default apiClient
