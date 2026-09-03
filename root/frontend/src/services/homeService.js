import apiClient, { getApiError } from '@/api/axios'

// Home page search
export async function searchDocuments(searchInput) {
    try {
        const res = await apiClient.get('/', { params: { search: searchInput } })
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// View all documents
export async function viewAllDocuments() {
    try {
        const res = await apiClient.get('/documento')
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

