import { ref } from 'vue'
import { deleteDocument } from '@/services/documentService'
import { getUserDocuments } from '@/services/userService'

function getDocumentRows(data) {
    if (Array.isArray(data)) {
        return data
    }

    if (Array.isArray(data?.docs)) {
        return data.docs
    }

    if (Array.isArray(data?.docRows)) {
        return data.docRows
    }

    return []
}

export function useUserDocuments() {
    const documents = ref([])
    const loading = ref(false)
    const deleting = ref(false)
    const error = ref(null)

    async function load() {
        loading.value = true
        error.value = null

        try {
            const result = await getUserDocuments()
            if (!result.success) {
                error.value = result.error
                documents.value = []
                return result
            }

            documents.value = getDocumentRows(result.data)
            return result
        } finally {
            loading.value = false
        }
    }

    async function remove(documentId) {
        deleting.value = true
        error.value = null

        try {
            const result = await deleteDocument(documentId)
            if (!result.success) {
                error.value = result.error
                return result
            }

            documents.value = documents.value.filter(
                (document) => document.id_documento !== documentId
            )
            return result
        } finally {
            deleting.value = false
        }
    }

    return {
        documents,
        loading,
        deleting,
        error,
        load,
        remove
    }
}
