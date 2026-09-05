import { computed, ref } from 'vue'
import { useDocumentSearch } from '@/composables/useDocumentSearch'
import { usePagination } from '@/composables/usePagination'

function getDocumentRows(data) {
    if (Array.isArray(data)) {
        return data
    }

    if (Array.isArray(data?.docRows)) {
        return data.docRows
    }

    if (Array.isArray(data?.docs)) {
        return data.docs
    }

    return []
}

export function useDocumentList(fetchDocuments) {
    const documents = ref([])
    const loading = ref(false)
    const error = ref(null)
    const { searchInput, searchDocuments } = useDocumentSearch()
    const {
        currentPage,
        previousPage,
        nextPage,
        getPaginatedItems,
        getTotalPages,
        resetPagination
    } = usePagination(5)

    const displayedDocuments = computed(() => {
        return searchDocuments(documents.value)
    })

    const paginatedDocuments = computed(() => {
        return getPaginatedItems(displayedDocuments.value)
    })

    const totalPages = computed(() => {
        return getTotalPages(displayedDocuments.value.length)
    })

    async function load(...args) {
        loading.value = true
        error.value = null
        resetPagination()

        try {
            const result = await fetchDocuments(...args)
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

    function search() {
        resetPagination()
    }

    function handleNextPage() {
        nextPage(displayedDocuments.value.length)
    }

    return {
        documents,
        displayedDocuments,
        paginatedDocuments,
        totalPages,
        searchInput,
        currentPage,
        loading,
        error,
        load,
        search,
        previousPage,
        handleNextPage
    }
}
