import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
//Lazy-loading files doesn't require import
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: () => import('../views/CadastroView.vue')
    },
    {
      path: '/minha-conta',
      name: 'minha-conta',
      component: () => import('../views/MinhaContaView.vue')
    },
    {
      path: '/minha-conta/meus-documentos',
      name: 'meus-documentos',
      component: () => import('../views/MeusDocsView.vue')
    },
    {
      path: '/minha-conta/novo-documento',
      name: 'novo-documento',
      component: () => import('../views/NovoDocView.vue')
    },
    {
      path: '/minha-conta/meus-documentos/alterar-documento/:id',
      name: 'alterar-documento',
      component: () => import('../views/AlterarDocView.vue')
    },
    {
      path: '/documento',
      name: 'documento',
      component: () => import('../views/DocView.vue')
    },
    {
      path: '/documento/id/:id',
      name: 'documentoId',
      component: () => import('../views/DocSingleView.vue')
    },

  ]
})

export default router
