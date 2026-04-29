<script setup>
import IconMariaDB from '@/components/icons/IconMariaDB.vue'
import IconExpress from '@/components/icons/IconExpress.vue'
import IconVue from '@/components/icons/IconVue.vue'
import IconNode from '@/components/icons/IconNode.vue'
import IconArrowUp from '@/components/icons/IconArrowUp.vue'
</script>

<template>
    <footer>
        <p>Feito com</p>

        <nav>
            <!--Tecnologias usadas, telefone, email, voltar para cima-->
            <ul>
                <li>
                    <a href="https://mariadb.org/" target="_blank"><IconMariaDB /></a>
                </li>
                <li>
                    <a href="https://expressjs.com/" target="_blank"><IconExpress /></a>
                </li>
                <li>
                    <a href="https://vuejs.org/" target="_blank"><IconVue /></a>
                </li>
                <li>
                    <a href="https://nodejs.org/en" target="_blank"><IconNode /></a>
                </li>
            </ul>
        </nav>

        <p>Todos os direitos reservados© - 2023</p>

        <a href="#"><IconArrowUp /></a>
    </footer>
</template>

<style scoped>
footer {
    height: 150px;
    color: var(--light-blue);
    text-align: center;
    background-color: var(--blue);

    position: relative;
}

p:first-of-type {
    padding-top: 5px;
}

nav ul {
    list-style-type: none;
}

nav ul li {
    display: inline-block;
    padding: 1rem 1rem;

    transition: 0.4s;
}

nav ul li:hover {
    background-color: var(--yellow);
}

footer nav li > a {
    background-color: transparent;
}

footer > a {
    position: absolute;
    top: 0;
    right: 0;
}
</style>
