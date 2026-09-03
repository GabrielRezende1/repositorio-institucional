import apiClient, { getApiError } from '@/api/axios'

export async function getFaq() {
    try {
        const res = await apiClient.get('/faq')
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

export async function getApresentacao() {
    try {
        const res = await apiClient.get('/apresentacao')
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

export async function getPoliticas() {
    try {
        const res = await apiClient.get('/politicas')
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

export async function downloadPoliticaFile(nome_arq) {
    try {
        const res = await apiClient.get('/politicas/' + encodeURIComponent(nome_arq), {
            responseType: 'blob'
        })
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

export async function getTutorial() {
    try {
        const res = await apiClient.get('/tutorial')
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

export async function downloadTutorialFile(nome_arq) {
    try {
        const res = await apiClient.get('/tutorial/' + encodeURIComponent(nome_arq), {
            responseType: 'blob'
        })
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}
