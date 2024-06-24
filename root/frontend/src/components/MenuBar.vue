<template>
    <nav class="menu">
        <ul>
            <li><RouterLink to="/minha-conta" class="RouterLink">Meus Dados</RouterLink></li>
            <li><RouterLink to="/minha-conta/meus-documentos" class="RouterLink">Meus Documentos</RouterLink></li>
            <li><RouterLink to="/minha-conta/novo-documento" class="RouterLink">Novo Documento</RouterLink></li>
        </ul>
    </nav><!--menu-->
</template>

<style scoped>
.menu {
    width: 800px;
    background-color: var(--yellow);
    margin: 0 auto;
}

.menu > ul {
    width: fit-content;
    list-style-type: none;
    margin: 0 auto;
}

.menu > ul li {
    display: inline-block;
}

.menu > ul li .RouterLink {
    padding: 0 1rem;
    font-weight: 600;
    font-size: 20px;
    border: 1px solid #cfd64a;
    margin: 0 1rem;
}

.menu > ul li .RouterLink:hover {
    background-color: #cfd64a;
}
</style>
