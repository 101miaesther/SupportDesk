import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'landing', component: () => import('@/views/public/LandingView.vue') },
    { path: '/submit', name: 'submit-ticket', component: () => import('@/views/public/SubmitTicketView.vue') },
    { path: '/track/:reference?', name: 'track-ticket', component: () => import('@/views/public/TrackTicketView.vue'), props: true },
    { path: '/login', name: 'login', component: () => import('@/views/staff/LoginVue.vue') },
    { path: '/staff/tickets', name: 'ticket-queue', component: () => import('@/views/staff/TicketQueueView.vue'), meta: { requiresAuth: true } },
    { path: '/staff/tickets/:id', name: 'ticket-detail', component: () => import('@/views/staff/TicketDetailView.vue'), props: true, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  const { currentUser } = useAuthStore()
  if (to.meta.requiresAuth && !currentUser) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router