import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/components/layout/LayoutDefault.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  // import.meta.env.BASE_URL tự lấy từ vite.config base = '/ocean-vue/'
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
