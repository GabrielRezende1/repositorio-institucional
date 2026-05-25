import { ref } from 'vue'

/**
 * usePagination Composable
 *
 * USED IN COMPONENTS:
 * - DocView.vue (pagination logic with search filtering)
 * - DocTypeView.vue (pagination logic with category filtering)
 *
 * Provides pagination state and computed properties for displaying paginated data
 */
export function usePagination(itemsPerPage = 5) {
    const currentPage = ref(1)
    const documentsPerPage = ref(itemsPerPage)

    function previousPage() {
        if (currentPage.value > 1) {
            currentPage.value--
        }
    }

    function nextPage(totalItems) {
        const totalPages = Math.ceil(totalItems / documentsPerPage.value)
        if (currentPage.value < totalPages) {
            currentPage.value++
        }
    }

    function getPaginatedItems(items) {
        const startIndex = (currentPage.value - 1) * documentsPerPage.value
        const endIndex = startIndex + documentsPerPage.value
        return items.slice(startIndex, endIndex)
    }

    function getTotalPages(totalItems) {
        return Math.ceil(totalItems / documentsPerPage.value)
    }

    function resetPagination() {
        currentPage.value = 1
    }

    return {
        currentPage,
        documentsPerPage,
        previousPage,
        nextPage,
        getPaginatedItems,
        getTotalPages,
        resetPagination
    }
}
