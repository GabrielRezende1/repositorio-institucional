<template>
    <nav class="menu">
        <ul>
            <li><a href="/minha-conta">Meus Dados</a></li>
            <li><a href="/minha-conta/meus-documentos">Meus Documentos</a></li>
            <li><a href="/minha-conta/novo-documento">Novo Documento</a></li>
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

.menu > ul li a {
    padding: 0 1rem;
    font-weight: 600;
    font-size: 20px;
    border: 1px solid #cfd64a;
    margin: 0 1rem;
}

.menu > ul li a:hover {
    background-color: #cfd64a;
}
</style>
