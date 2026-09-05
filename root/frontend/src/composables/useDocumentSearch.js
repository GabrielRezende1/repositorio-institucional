import { ref } from 'vue'

/**
 * useDocumentSearch Composable
 *
 * USED IN COMPONENTS:
 * - HomeView.vue (search by title functionality)
 * - DocView.vue (search by title, author, or description)
 *
 * Provides search filtering logic for documents
 */
export function useDocumentSearch() {
    const searchInput = ref('')
    function getFieldValue(document, field) {
        return field.split('.').reduce((value, key) => value?.[key], document)
    }

    function searchDocuments(allDocuments, searchFields = [
        'nome_doc',
        'Doc_tipo.tipo',
        'Discente.nome',
        'Docente.nome',
        'resumo'
    ]) {
        if (!searchInput.value) {
            return allDocuments
        }

        const searchTerm = searchInput.value.toLowerCase()
        return allDocuments.filter((doc) => {
            return searchFields.some((field) => {
                const fieldValue = getFieldValue(doc, field)?.toString().toLowerCase() || ''
                return fieldValue.includes(searchTerm)
            })
        })
    }
    function clearSearch() {
        searchInput.value = ''
    }

    return {
        searchInput,
        searchDocuments,
        clearSearch
    }
}
