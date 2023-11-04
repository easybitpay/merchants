import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    /**
     * Main Routes
     */
    {
      path: '/',
      redirect: '/dashboard',
      component: () => import('@/layouts/Main.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/views/app/Dashboard.vue')
        },
        {
          path: '/plugin',
          name: 'plugin',
          component: () => import('@/views/app/Plugins.vue')
        },
        {
          path: '/applications',
          name: 'applications',
          component: () => import('@/views/app/Applications.vue')
        },
        {
          path: '/application',
          name: 'application',
          component: () => import('@/layouts/Application.vue'),
          
          children: [
            {
              path: 'overview',
              name: 'application-overview',
              component: () => import('@/views/app/application/Overview.vue')
            },
            {
              path: 'transaction',
              name: 'application-transaction',
              component: () => import('@/views/app/application/Transaction.vue')
            },
            {
              path: 'setting',
              name: 'application-setting',
              component: () => import('@/views/app/application/Setting.vue')
            },
            {
              path: 'notification',
              name: 'application-notification',
              component: () => import('@/views/app/application/Notification.vue')
            }
          ]
        },
        {
          path: '/settings',
          name: 'settings',
          redirect: '/settings/basic',
          component: () => import('@/layouts/Settings.vue'),

          children: [
            {
              path: 'basic',
              name: 'settings-basic',
              component: () => import('@/views/app/settings/Basic.vue')
            },
            {
              path: 'privacy',
              name: 'settings-privacy',
              component: () => import('@/views/app/settings/Privacy.vue')
            },
            {
              path: 'customize',
              name: 'settings-customize',
              component: () => import('@/views/app/settings/Customize.vue')
            }
          ]
        },
        {
          path: '/help',
          name: 'help',
          redirect: '/help/knowledge',
          component: () => import('@/layouts/Help.vue'),

          children: [
            {
              path: 'knowledge',
              name: 'help-knowledge',
              component: () => import('@/views/app/help/Knowledge.vue')
            },
            {
              path: 'faq',
              name: 'help-faq',
              component: () => import('@/views/app/help/FAQ.vue')
            },
            {
              path: 'ticket',
              name: 'help-ticket',
              component: () => import('@/views/app/help/Ticket.vue')
            }
          ]
        },
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

router.beforeEach(() => {
  // Scroll page to top on every route change
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 100)
})

export default router
