<script setup>
import { getFaq } from '@/services/contentService'
import { useAsyncState } from '@/composables/useAsyncState'

const { data, execute } = useAsyncState({})

execute(getFaq)
</script>

<template>
    <section class="page-section content-page">
        <h2 class="page-heading">Perguntas Frequentes</h2>
        <table class="data-table">
            <tbody>
                <tr v-for="doc in data" :key="doc">
                    <td>{{ doc }}</td>
                </tr><!-- v-for -->
            </tbody>
        </table>
    </section>
</template>

<style scoped>
.data-table td {
    text-align: justify;
    font-size: 1.05rem;
}
</style>