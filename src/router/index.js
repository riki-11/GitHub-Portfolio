import { createRouter, createWebHistory } from 'vue-router'

import Input from '../views/Input.vue'
import Results from '../views/Results.vue'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/input',
      name: 'Input',
      component: Input
    },
    {
      path: '/results',
      name: 'Results',
      component: Results,
      meta: {
        requiresInput: true 
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresInput && from.path !== '/input') {
    next('/');
  } else {
    next();
  }
});

export default router