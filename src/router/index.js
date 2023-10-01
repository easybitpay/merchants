import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    /**
     * Auth Routes
     */
    {
      path: '/',
      component: () => import('@/layouts/Auth.vue'),
      children: [
        {
          name: 'login',
          path: '/login',
          component: () => import('@/views/auth/Login.vue')
        },
        {
          name: 'register',
          path: '/register',
          component: () => import('@/views/auth/Register.vue')
        },
        {
          name: 'reset-password',
          path: '/forget-password',
          component: () => import('@/views/auth/ResetPassword.vue')
        }
      ]
    }
  ]
})

export default router
