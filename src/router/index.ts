import { createRouter, createWebHashHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'
import { useAuthStore } from '@/stores/auth'
import Cookies from 'js-cookie'
import { authRoutes, getFirstAuthorized } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: authRoutes
    },
    {
      path: '/',
      component: GuestLayout,
      meta: { requiresAuth: false },
      children: [
        {
          path: 'login',
          component: () => import('../views/Guest/LoginView.vue'),
          name: 'login',
          meta: { title: 'Iniciar Sesión' }
        },
        {
          path: 'registrar',
          component: () => import('../views/Guest/RegisterView.vue'),
          name: 'register',
          meta: { title: 'Registrarse' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = Cookies.get('edo_token')
  const { getCurrentRole } = useAuthStore()

  if (to.name === 'billing.show') {
    document.title = 'Factura-' + to.params.id
  } else {
    document.title = to.meta.title + ' - Envíos de Occidente'
  }

  const roles = to.meta?.roles as string[]

  //Si no hay token y la ruta requiere autenticación
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } else if (
    (!to.meta.requiresAuth && token) ||
    (to.meta?.roles && !roles.includes(getCurrentRole()))
  ) {
    next(getFirstAuthorized(getCurrentRole()))
  }

  //Todo OK
  else {
    next()
  }
})

export default router
