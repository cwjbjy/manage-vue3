import { createRouter, createWebHistory } from 'vue-router';

import app from '../main';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    app.$cookies.keys().forEach((item) => app.$cookies.remove(item));
  }
  let token = app.$cookies.get('token');

  if (!token && to.path !== '/login') {
    next({
      path: '/login',
    });
  } else {
    next();
  }
});

export default router;
