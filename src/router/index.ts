import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/firebaseInit'
import { useCardStore, useErrorStore } from '@/stores'
// import Home from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      children: [
        {
          path: '/board/:boardId',
          name: 'board',
          component: () => import('@/views/BoardView.vue'),
          props: (route) => ({ boardId: route.params.boardId }),
        },
        {
          path: '/card/:cardId',
          name: 'card',
          component: () => import('@/views/BoardView.vue'),
          props: (route) => ({ cardId: route.params.cardId }),
        },
      ],
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('@/views/SignInView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const errorStore = useErrorStore()

  if (to.path === '/sign-in' && isAuthenticated.value) {
    next('/')
    return
  }

  if (!isAuthenticated.value && to.path !== '/sign-in') {
    next('/sign-in')
    return
  }

  // Check for non-existent routes or existing error message (set in BoardView when no id for board found)
  if (!router.hasRoute(to.name) || errorStore.errorMessage) {
    // Set error message and show error component without changing URL
    if (!errorStore.errorMessage) errorStore.triggerError('')
    next(false)
    return
  }

  // Clear any existing error
  errorStore.clearError()
  next()
})

export default router
