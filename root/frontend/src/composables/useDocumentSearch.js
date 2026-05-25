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

    function searchDocuments(allDocuments, searchFields = ['titulo', 'autores', 'descricao']) {
        if (!searchInput.value) {
            return allDocuments
        }

        const searchTerm = searchInput.value.toLowerCase()
        return allDocuments.filter((doc) => {
            return searchFields.some((field) => {
                const fieldValue = doc[field]?.toString().toLowerCase() || ''
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
