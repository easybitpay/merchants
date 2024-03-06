import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import authRequired from '@/core/router-guards/authRequired'
import loginCheck from '@/core/router-guards/loginCheck'

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
      beforeEnter: authRequired,
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
          path: '/notification',
          name: 'notification',
          component: () => import('@/views/app/Notifications.vue')
        },
        {
          path: '/exchange',
          name: 'exchange',
          component: () => import('@/views/app/Exchange.vue')
        },
        {
          path: '/add-application',
          name: 'add-application',
          component: () => import('@/views/app/AddApplication.vue')
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
              path: 'overview/:id',
              name: 'application-overview',
              component: () => import('@/views/app/application/Overview.vue')
            },
            {
              path: 'transaction/:id',
              name: 'application-transaction',
              component: () => import('@/views/app/application/Transaction.vue')
            },
            {
              path: 'setting/:id',
              name: 'application-setting',
              component: () => import('@/views/app/application/Setting.vue')
            },
            {
              path: 'notification/:id',
              name: 'application-notification',
              component: () => import('@/views/app/application/Notification.vue')
            },
            {
              path: 'withdraw/:id',
              name: 'application-withdraw',
              component: () => import('@/views/app/application/Withdraw.vue')
            }
          ]
        },
        {
          path: '/search-transaction/:id',
          name: 'search-transaction',
          component: () => import('@/views/app/application/TransactionFocusMode.vue')
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
              path: 'notification',
              name: 'settings-notification',
              component: () => import('@/views/app/settings/Notification.vue')
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
          beforeEnter: loginCheck,
          component: () => import('@/views/auth/Login.vue')
        },
        {
          path: '/register',
          name: 'register',
          beforeEnter: loginCheck,
          component: () => import('@/views/auth/Register.vue')
        },
        {
          path: '/forget-password',
          name: 'reset-password',
          beforeEnter: loginCheck,
          component: () => import('@/views/auth/ResetPassword.vue')
        },
        {
          path: '/email-verify/:token',
          name: 'email-verify',
          component: () => import('@/views/auth/EmailVerify.vue')
        }
      ]
    },
    /**
     * Pay Layout
     */
    {
      path: '/pay',
      redirect: '/pay/invoice',
      component: () => import('@/layouts/PayLayout.vue'),
      children: [
        {
          path: 'invoice/:id',
          name: 'select-coin',
          component: () => import('@/views/pay/SelectToken.vue')
        },
        {
          path: 'gateway/:id',
          name: 'gateway',
          component: () => import('@/views/pay/Gateway.vue')
        },
        {
          path: 'status/:id',
          name: 'status',
          component: () => import('@/views/pay/Status.vue')
        }
      ]
    },
    /**
     * Pay Sandbox Layout
     */
    {
      path: '/pay-sandbox',
      redirect: '/pay/invoice',
      component: () => import('@/layouts/PayLayout.vue'),
      props: { sandbox: true },
      children: [
        {
          path: 'invoice/:id',
          name: 'select-coin-sandbox',
          component: () => import('@/views/pay/SelectToken.vue'),
          props: { sandbox: true }
        },
        {
          path: 'gateway/:id',
          name: 'gateway-sandbox',
          component: () => import('@/views/pay/Gateway.vue'),
          props: { sandbox: true }
        },
        {
          path: 'status/:id',
          name: 'status-sandbox',
          component: () => import('@/views/pay/Status.vue'),
          props: { sandbox: true }
        }
      ]
    },
    {
      // the 404 route, when none of the above matches
      path: '/404',
      name: '404',
      component: () => import('@/views/Error404.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
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
