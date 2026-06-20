import axios from 'axios'

// Get all documents
export async function getAllDocuments() {
    try {
        const res = await axios.get('http://localhost:3000/api/documento')
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Get documents by type
export async function getDocumentsByType(tipo) {
    try {
        const displayType = tipo.replace(/\+/g, ' ')
        const res = await axios.get('http://localhost:3000/api/documento/tipo/' + displayType)
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Get document by ID
export async function getDocumentById(id) {
    try {
        const res = await axios.get('http://localhost:3000/api/documento/id/' + id)
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Download document
export async function downloadDocument(id_doc, nome_arq) {
    try {
        const res = await axios.get('http://localhost:3000/api/documento/download/' + id_doc + '/' + nome_arq, {
            responseType: 'blob'
        })
        return { success: true, data: res.data }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

/**
 * LOGGED USER ROUTES
 */

// Create document
export async function createDocument(formData) {
    try {
        const res = await axios.post(
            'http://localhost:3000/api/minha-conta/novo-documento',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            }
        )
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Get document for edit
export async function getDocumentForEdit(id) {
    try {
        const res = await axios.get(
            'http://localhost:3000/api/minha-conta/meus-documentos/alterar-documento/' + id,
        {withCredentials: true})
        return { success: true, data: res.data, status: res.status}
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Update document
export async function updateDocument(id, formData) {
    try {
        const res = await axios.put(
            'http://localhost:3000/api/minha-conta/meus-documentos/alterar-documento/' + id,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            }
        )
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}

// Delete document
export async function deleteDocument(id) {
    try {
        const res = await axios.delete(
            'http://localhost:3000/api/minha-conta/meus-documentos/' + id,
            { withCredentials: true }
        )
        return { success: true, data: res.data, status: res.status }
    } catch (err) {
        return { success: false, error: err.response?.data }
    }
}
