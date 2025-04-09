import { createRouter, createWebHashHistory } from 'vue-router'

import routes from './routes'
import { useAuthStore } from '../stores/auth';


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})


// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
//   if (to.name !== 'Login' && !authStore.token) {
//     next({ name: 'Login' }); // 未登录则重定向到登录页面
//   } else {
//     next(); // 已登录则放行
//   }
// });

export default router
