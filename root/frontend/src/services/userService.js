import axios from 'axios'

// Get user profile
export async function getUserProfile() {
    try {
        const res = await axios.get('http://localhost:3000/api/minha-conta', {
            withCredentials: true
        })
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Update user profile
export async function updateUserProfile(nome, email) {
    try {
        const res = await axios.put(
            'http://localhost:3000/api/minha-conta',
            {
                nome: nome,
                email: email
            },
            { withCredentials: true }
        )
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Register user
export async function registerUser(nome, email, senha, tipo) {
    try {
        const res = await axios.post('http://localhost:3000/api/cadastro', {
            nome: nome,
            email: email,
            senha: senha,
            tipo: tipo
        })
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Get user's documents
export async function getUserDocuments() {
    try {
        const res = await axios.get('http://localhost:3000/api/minha-conta/meus-documentos', {
            withCredentials: true
        })
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}
