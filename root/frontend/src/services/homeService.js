import axios from 'axios'

// Home page search
export async function searchDocuments(searchInput) {
    try {
        const res = await axios.get('http://localhost:3000/api/?search=' + searchInput)
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// View all documents
export async function viewAllDocuments() {
    try {
        const res = await axios.get('http://localhost:3000/api/documento')
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// FAQ
export async function getFaq() {
    try {
        const res = await axios.get('http://localhost:3000/api/faq')
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Apresentacao
export async function getApresentacao() {
    try {
        const res = await axios.get('http://localhost:3000/api/apresentacao')
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Politicas
export async function getPoliticas() {
    try {
        const res = await axios.get('http://localhost:3000/api/politicas')
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Download politica file
export async function downloadPoliticaFile(nome_arq) {
    try {
        const res = await axios.get('http://localhost:3000/api/politicas/' + nome_arq, {
            responseType: 'blob'
        })
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Tutorial
export async function getTutorial() {
    try {
        const res = await axios.get('http://localhost:3000/api/tutorial')
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Download tutorial file
export async function downloadTutorialFile(nome_arq) {
    try {
        const res = await axios.get('http://localhost:3000/api/tutorial/' + nome_arq, {
            responseType: 'blob'
        })
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}
