import { reactive, ref } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'

function getErrorMessage(error) {
    if (typeof error === 'string') {
        return error
    }

    return error?.message || error?.error || 'Erro ao salvar documento'
}

export function useDocumentForm(initialValues = {}, fileField = 'file') {
    const form = reactive({
        ...initialValues,
        file: null
    })
    const submitting = ref(false)
    const { formErrors, formSuccess, clearMessages, setError, setSuccess } = useFormValidation()

    function handleFileUpload(event) {
        form.file = event.target.files?.[0] || null
    }

    function createFormData() {
        const formData = new FormData()

        Object.entries(form).forEach(([field, value]) => {
            if (!['file', 'doc_id'].includes(field) && value !== undefined && value !== null) {
                formData.append(field, value)
            }
        })

        if (form.file) {
            formData.append(fileField, form.file)
            console.log(formData)
        }

        return formData
    }

    async function submit(submitRequest) {
        clearMessages()
        submitting.value = true

        try {
            const result = await submitRequest(createFormData())
            if (!result.success) {
                setError(getErrorMessage(result.error))
                return result
            }

            setSuccess('Documento salvo com sucesso!')
            return result
        } finally {
            submitting.value = false
        }
    }

    return {
        form,
        submitting,
        formErrors,
        formSuccess,
        clearMessages,
        handleFileUpload,
        createFormData,
        submit,
        setError,
        setSuccess
    }
}
