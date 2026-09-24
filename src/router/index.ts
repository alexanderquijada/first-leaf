import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

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
const P303 = 'P303 · Mobile experience'

// The one app (BRIEF.md §7). The layout loads with the first screen; pages inside it are lazy.
const app: RouteRecordRaw = {
  path: '/',
  component: AppLayout,
  children: [
    { path: 'alerts', component: () => import('@/features/alerts/AlertsView.vue'), meta: { title: 'Alerts' } },
    { path: 'alerts/:id', component: () => import('@/features/alerts/AlertDetailView.vue'), meta: { title: 'Alert' } },
    { path: 'activity', component: () => import('@/features/activity/ActivityView.vue'), meta: { title: 'Activity' } },
    { path: 'funds', component: () => import('@/features/funds/FundsView.vue'), meta: { title: 'Your funds' } },
    { path: 'funds/:ticker', component: () => import('@/features/funds/FundView.vue'), meta: { title: 'Your funds' } },
    { path: 'learn', component: () => import('@/features/learn/LearnView.vue'), meta: { title: 'Words to know' } },
    { path: 'learn/:termId', component: () => import('@/features/learn/TermView.vue'), meta: { title: 'Words to know' } },
  ],
}

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
    path: '/p303',
    name: 'p303',
    component: () => import('@/p303-mobile/views/CheckInView.vue'),
    meta: { title: 'P303 · Check-in' },
  },
  comingSoon('/p303/attention', 'What needs you', P303, '/p303'),
  comingSoon('/p303/attention/:id', 'What needs you', P303, '/p303'),
  comingSoon('/p303/why', 'Why it moved', P303, '/p303'),
  comingSoon('/p303/learn', 'Words', P303, '/p303'),
  comingSoon('/p303/learn/:termId', 'Words', P303, '/p303'),
  comingSoon('/p303/practice', 'Practice', P303, '/p303'),
  app,
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
  scrollBehavior: (to, _from, saved) => saved ?? (to.hash ? { el: to.hash } : { top: 0 }),
})

// Each page gets its own title, so tabs and screen readers can tell them apart.
router.afterEach((to) => {
  const t = to.meta.title as string | undefined
  document.title = t && t !== 'First Leaf' ? `${t} · First Leaf` : 'First Leaf'
})

export default router
