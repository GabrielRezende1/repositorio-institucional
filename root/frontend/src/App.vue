<script setup>
import { RouterView } from 'vue-router';
import HeaderPartial from './components/HeaderPartial.vue';
import FooterPartial from './components/FooterPartial.vue';
</script>

<template>
  <head>
    <meta charset="utf-8" />
	  <meta name="viewport" content="width=device-width;initial-scale=1.0;maximum-scale=1.0">
  </head>
  <HeaderPartial />
  <RouterView />
  <FooterPartial />
</template>

<style scoped>
nav a.router-link-exact-active {
  color: var(--blue);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

@media (min-width: 1024px) {
/*   header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  } */
}
</style>
