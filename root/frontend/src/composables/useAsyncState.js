import { ref } from 'vue'

export function useAsyncState(initialData = null) {
    const data = ref(initialData)
    const loading = ref(false)
    const error = ref(null)

    async function execute(asyncFunction) {
        loading.value = true
        error.value = null

        try {
            const result = await asyncFunction()
            if (!result.success) {
                error.value = result.error
                return result
            }

            data.value = result.data
            return result
        } finally {
            loading.value = false
        }
    }

    function reset() {
        data.value = initialData
        loading.value = false
        error.value = null
    }

    return {
        data,
        loading,
        error,
        execute,
        reset
    }
}
