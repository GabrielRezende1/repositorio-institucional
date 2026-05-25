import { ref } from 'vue'

/**
 * useFormValidation Composable
 *
 * USED IN COMPONENTS:
 * - CadastroView.vue (password confirmation validation)
 * - NovoDocView.vue (form submission feedback)
 * - AlterarDocView.vue (form submission feedback)
 *
 * Provides form validation and error/success message handling
 */
export function useFormValidation() {
    const formErrors = ref('')
    const formSuccess = ref('')

    function clearMessages() {
        formErrors.value = ''
        formSuccess.value = ''
    }

    function setError(message) {
        formErrors.value = message
        formSuccess.value = ''
    }

    function setSuccess(message) {
        formSuccess.value = message
        formErrors.value = ''
    }

    function validatePasswordMatch(password, confirmPassword) {
        if (password !== confirmPassword) {
            setError('Senhas não conferem!')
            return false
        }
        clearMessages()
        return true
    }

    return {
        formErrors,
        formSuccess,
        clearMessages,
        setError,
        setSuccess,
        validatePasswordMatch
    }
}
