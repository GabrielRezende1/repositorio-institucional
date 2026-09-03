import apiClient, { getApiError } from '@/api/axios'

// Get all documents
export async function getAllDocuments() {
    try {
        const res = await apiClient.get('/documento')
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// Get documents by type
export async function getDocumentsByType(tipo) {
    try {
        const displayType = tipo.replace(/\+/g, ' ')
        const res = await apiClient.get('/documento/tipo/' + encodeURIComponent(displayType))
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// Get document by ID
export async function getDocumentById(id) {
    try {
        const res = await apiClient.get('/documento/id/' + encodeURIComponent(id))
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// Download document
export async function downloadDocument(id_doc, nome_arq) {
    try {
        const res = await apiClient.get('/documento/download/' + encodeURIComponent(id_doc) + '/' + encodeURIComponent(nome_arq), {
            responseType: 'blob'
        })
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

/**
 * LOGGED USER ROUTES
 */

// Get document for creation
export async function getNewDocumentForm() {
    try {
        const res = await apiClient.get('/minha-conta/novo-documento')
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// Create document
export async function createDocument(formData) {
    try {
        const res = await apiClient.post(
            '/minha-conta/novo-documento',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }
        )
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// Get document for edit
export async function getDocumentForEdit(id) {
    try {
        const res = await apiClient.get(
            '/minha-conta/meus-documentos/alterar-documento/' + encodeURIComponent(id))
        return { success: true, data: res.data, status: res.status}
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// Update document
export async function updateDocument(id, formData) {
    try {
        const res = await apiClient.put(
            '/minha-conta/meus-documentos/alterar-documento/' + encodeURIComponent(id),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}

// Delete document
export async function deleteDocument(id) {
    try {
        const res = await apiClient.delete(
            '/minha-conta/meus-documentos/' + encodeURIComponent(id)
        )
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: getApiError(err), status: err.response?.status }
    }
}
