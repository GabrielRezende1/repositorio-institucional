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
    margin: 0 auto;
    margin-bottom: 1rem;
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
    background-color: var(--yellow);
    border: 1px solid #cfd64a;
    border-radius: 3px;
    margin: 0 1rem;
}

.menu > ul li .RouterLink:hover {
    background-color: #cfd64a;
}

/**
 * Media Queries
 */

@media screen and (max-width: 800px) {
  .menu {
    width: 100%;
  }

  .menu > ul li {
    display: block;
    text-align: center;
  }
}
</style>
