import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from '@/firebaseInit';
// import Dashboard from '@/views/DashboardView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('@/views/SignInView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path === '/sign-in' && isAuthenticated.value) {
    next('/');
    return;
  }

  if (to.path === '/' && !isAuthenticated.value) {
    next('/sign-in');
    return;
  }

  next();
});

export default router;
