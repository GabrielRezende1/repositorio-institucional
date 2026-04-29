import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/HomeView.vue'
import FaqView from '@/pages/FaqView.vue'
import ApresentacaoView from '@/pages/ApresentacaoView.vue'
import TutorialView from '@/pages/TutorialView.vue'
import PoliticaView from '@/pages/PoliticaView.vue'
//Lazy-loading files doesn't require import
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            // ========== general paths ==========
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/faq',
            name: 'faq',
            component: FaqView
        },
        {
            path: '/apresentacao',
            name: 'apresentacao',
            component: ApresentacaoView
        },
        {
            path: '/tutorial',
            name: 'tutorial',
            component: TutorialView
        },
        {
            path: '/politicas',
            name: 'politica',
            component: PoliticaView
        },
        {   // ========== logged paths ==========
            path: '/login',
            name: 'login',
            component: () => import('@/pages/LoginView.vue')
        },
        {
            path: '/cadastro',
            name: 'cadastro',
            component: () => import('@/pages/CadastroView.vue')
        },
        {
            path: '/minha-conta',
            name: 'minha-conta',
            component: () => import('@/pages/MinhaContaView.vue')
        },
        {
            path: '/minha-conta/meus-documentos',
            name: 'meus-documentos',
            component: () => import('@/pages/MeusDocsView.vue')
        },
        {
            path: '/minha-conta/novo-documento',
            name: 'novo-documento',
            component: () => import('@/pages/NovoDocView.vue')
        },
        {
            path: '/minha-conta/meus-documentos/alterar-documento/:id',
            name: 'alterar-documento',
            component: () => import('@/pages/AlterarDocView.vue')
        },
        {
            // ========== doc paths ==========
            path: '/documento',
            name: 'documento',
            component: () => import('@/pages/DocView.vue')
        },
        {
            path: '/documento/id/:id',
            name: 'documentoId',
            component: () => import('@/pages/DocSingleView.vue')
        },
        {
            path: '/documento/tipo/:tipo',
            name: 'documentoTipo',
            component: () => import('@/pages/DocTypeView.vue')
        }
    ]
})

export default router
