import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Every route is lazy-loaded (CLAUDE.md §7). Routes follow BRIEF.md §7.
// Sub-pages that are built in Phase 1 show a shared "Coming in Phase 1" page.
const comingSoon = (
  path: string,
  title: string | ((params: Record<string, string | string[]>) => string),
  caseStudy: string,
  backTo: string,
): RouteRecordRaw => ({
  path,
  component: () => import('@/shared/components/ComingSoon.vue'),
  props: (route) => ({
    title: typeof title === 'function' ? title(route.params) : title,
    caseStudy,
    backTo,
  }),
  meta: { title: typeof title === 'string' ? title : caseStudy },
})

const P301 = 'P301 · Operational dashboard'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/landing/LandingView.vue'),
    meta: { title: 'First Leaf' },
  },
  {
    path: '/p301',
    name: 'p301',
    component: () => import('@/p301-dashboard/views/WeeklyReviewView.vue'),
    meta: { title: 'P301 · Weekly review' },
  },
  comingSoon('/p301/funds', 'Your funds', P301, '/p301'),
  comingSoon('/p301/funds/:ticker', (p) => String(p.ticker), P301, '/p301'),
  comingSoon('/p301/activity', 'Activity', P301, '/p301'),
  comingSoon('/p301/practice', 'Practice', P301, '/p301'),
  comingSoon('/p301/learn', 'Words to know', P301, '/p301'),
  {
    path: '/p302',
    name: 'p302',
    component: () => import('@/p302-story/views/StoryView.vue'),
    meta: { title: 'P302 · Start early beats start big' },
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
