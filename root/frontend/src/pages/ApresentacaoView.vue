<script setup>
import { getApresentacao } from '@/services/contentService'
import { useAsyncState } from '@/composables/useAsyncState'

const { data, execute } = useAsyncState({})

execute(getApresentacao)
</script>

<template>
<section class="page-section content-page">
    <h2 class="page-heading">Apresentação</h2>
    <p>{{ data.apresentacao }}</p>
    <hr>
    <h2 class="page-heading">Missão</h2>
    <p>{{ data.missao }}</p>
    <hr>
    <h2 class="page-heading">Objetivo</h2>
    <p>{{ data.objetivo }}</p>
</section>
</template>

<style scoped>
.content-page p {
    padding: 0 var(--space-4);
    font-size: 1.1rem;
    text-align: justify;
}

@media screen and (max-width: 800px) {
    .content-page p {
        padding: 0;
    }
}
</style>