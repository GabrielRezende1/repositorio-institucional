import apiClient, { getApiError } from '@/api/axios'

// Get user profile
export async function getUserProfile() {
    try {
        const res = await apiClient.get('/minha-conta')
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// Update user profile
export async function updateUserProfile(nome, email) {
    try {
        const res = await apiClient.put(
            '/minha-conta',
            {
                nome: nome,
                email: email
            },
        )
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// Register user
export async function registerUser(name, email, password, confirmPassword, type) {
    try {
        const res = await apiClient.post('/cadastro', {
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            type: type
        })
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// Get user's documents
export async function getUserDocuments() {
    try {
        const res = await apiClient.get('/minha-conta/meus-documentos')
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}
