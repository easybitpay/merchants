import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    /**
     * Main Routes
     */
    {
      path: "/",
      redirect: '/dashboard',
      component: () => import('@/layouts/Main.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/app/Dashboard.vue')
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('@/views/app/Settings.vue')
        },
        {
          path: '/help',
          name: 'help',
          component: () => import('@/views/app/help.vue')
        }
      ]
    },
    /**
     * Auth Routes
     */
    {
      path: '/',
      component: () => import('@/layouts/Auth.vue'),
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/auth/Login.vue')
        },
        {
          path: '/register',
          name: 'register',
          component: () => import('@/views/auth/Register.vue')
        },
        {
          path: '/forget-password',
          name: 'reset-password',
          component: () => import('@/views/auth/ResetPassword.vue')
        }
      ]
    }
  ]
})

export default router
