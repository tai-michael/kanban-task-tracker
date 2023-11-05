import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/firebaseInit'
import { useCardStore } from '@/stores'
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
  const cardStore = useCardStore()
  if (to.path === '/sign-in' && isAuthenticated.value) {
    next('/')
    return
  }

  if (!isAuthenticated.value && to.path !== '/sign-in') {
    next('/sign-in')
    return
  }

  next()
})

export default router
