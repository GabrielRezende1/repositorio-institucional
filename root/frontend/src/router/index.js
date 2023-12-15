import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
//import ProdutoView from '../views/HomeView.vue' //doesn't need because lazy-loading
//import LoginView from '../views/HomeView.vue'
//import CadastroView from '../views/HomeView.vue'
import MinhaContaView from '../views/MinhaContaView.vue'

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
      component: MinhaContaView
    },
  ]
})

export default router
