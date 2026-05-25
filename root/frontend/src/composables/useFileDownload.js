import { downloadDocument } from '@/services/documentService'
import { downloadTutorialFile, downloadPoliticaFile } from '@/services/homeService'

/**
 * useFileDownload Composable
 *
 * REFACTORED: Now uses service layer for all file downloads
 * - documentService: for document PDFs
 * - homeService: for tutorial and policy files
 *
 * USED IN COMPONENTS:
 * - TutorialView.vue (downloadFile method)
 * - PoliticaView.vue (downloadFile method)
 * - MeusDocsView.vue (downloadFile method)
 * - DocView.vue (downloadFile method)
 * - DocSingleView.vue (downloadFile method)
 * - DocTypeView.vue (downloadFile method)
 *
 * Centralizes file download logic across all page components
 */
export function useFileDownload() {
    /**
     * Generic file download function
     * @param {Function} downloadService - The service function to call (e.g., downloadDocument)
     * @param {...any} args - Arguments to pass to the service function
     */
    async function downloadFile (downloadService, ...args) {
        const result = await downloadService(...args)
        if (result.success) {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(
                new Blob([result.data], { type: 'application/pdf' })
            )
            document.body.appendChild(link)
            link.setAttribute('download', args[args.length - 1]) // Last arg is usually the filename
            link.click()
            link.remove()
            URL.revokeObjectURL(link.href)
        } else {
            console.log(result.error)
        }
    }

    /**
     * Download a document by ID and filename
     */
    function downloadDocumentFile(id_doc, nome_arq) {
        return downloadFile(downloadDocument, id_doc, nome_arq)
    }

    /**
     * Download a tutorial file by filename
     */
    function downloadTutorial(nome_arq) {
        return downloadFile(downloadTutorialFile, nome_arq)
    }

    /**
     * Download a policy file by filename
     */
    function downloadPolicy(nome_arq) {
        return downloadFile(downloadPoliticaFile, nome_arq)
    }

    return {
        downloadFile,
        downloadDocumentFile,
        downloadTutorial,
        downloadPolicy
    }
}
