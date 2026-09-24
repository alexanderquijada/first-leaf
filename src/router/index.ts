import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Every route is lazy-loaded (CLAUDE.md §7). Routes follow BRIEF.md §7.
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/landing/LandingView.vue'),
    meta: { title: 'First Leaf' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/landing/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
})

// Each page gets its own title, so tabs and screen readers can tell them apart.
router.afterEach((to) => {
  const t = to.meta.title as string | undefined
  document.title = t && t !== 'First Leaf' ? `${t} · First Leaf` : 'First Leaf'
})

export default router
