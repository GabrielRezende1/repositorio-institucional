import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import HomeView from '@/pages/HomeView.vue'
import FaqView from '@/pages/FaqView.vue'
import ApresentacaoView from '@/pages/ApresentacaoView.vue'
import TutorialView from '@/pages/TutorialView.vue'
import PoliticaView from '@/pages/PoliticaView.vue'

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
            meta: { guestOnly: true },
            component: () => import('@/pages/LoginView.vue')
        },
        {
            path: '/cadastro',
            name: 'cadastro',
            meta: { guestOnly: true },
            component: () => import('@/pages/CadastroView.vue')
        },
        {
            path: '/minha-conta',
            name: 'minha-conta',
            meta: { requiresAuth: true },
            component: () => import('@/pages/MinhaContaView.vue')
        },
        {
            path: '/minha-conta/meus-documentos',
            name: 'meus-documentos',
            meta: { requiresAuth: true },
            component: () => import('@/pages/MeusDocsView.vue')
        },
        {
            path: '/minha-conta/novo-documento',
            name: 'novo-documento',
            meta: { requiresAuth: true },
            component: () => import('@/pages/NovoDocView.vue')
        },
        {
            path: '/minha-conta/meus-documentos/alterar-documento/:id',
            name: 'alterar-documento',
            meta: { requiresAuth: true },
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

router.beforeEach(async (to) => {
    const auth = useAuthStore()
    const isAuthenticated = await auth.initialize()

    if (to.meta.requiresAuth && !isAuthenticated) {
        return { name: 'login' }
    }

    if (to.meta.guestOnly && isAuthenticated) {
        return { name: 'home' }
    }
})

export default router
