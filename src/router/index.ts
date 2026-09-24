import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import HomeView from '@/features/home/HomeView.vue'

// One app (BRIEF.md §3, §7). The router wires the layout to each feature's pages.
// The layout and Home load with the first screen; every other page is lazy.
const app: RouteRecordRaw = {
  path: '/',
  component: AppLayout,
  children: [
    { path: '', name: 'home', component: HomeView, meta: { title: 'Home' } },
    { path: 'alerts', component: () => import('@/features/alerts/AlertsView.vue'), meta: { title: 'Alerts' } },
    { path: 'alerts/:id', component: () => import('@/features/alerts/AlertDetailView.vue'), meta: { title: 'Alert' } },
    { path: 'activity', component: () => import('@/features/activity/ActivityView.vue'), meta: { title: 'Activity' } },
    { path: 'funds', component: () => import('@/features/funds/FundsView.vue'), meta: { title: 'Your funds' } },
    { path: 'funds/:ticker', component: () => import('@/features/funds/FundView.vue'), meta: { title: 'Your funds' } },
    { path: 'story', component: () => import('@/features/story/StoryView.vue'), meta: { title: 'Your money story' } },
    { path: 'practice', component: () => import('@/features/practice/PracticeView.vue'), meta: { title: 'Practice' } },
    { path: 'learn', component: () => import('@/features/learn/LearnView.vue'), meta: { title: 'Words to know' } },
    { path: 'learn/:termId', component: () => import('@/features/learn/TermView.vue'), meta: { title: 'Words to know' } },
    { path: ':pathMatch(.*)*', name: 'not-found', component: () => import('@/features/not-found/NotFoundView.vue'), meta: { title: 'Page not found' } },
  ],
}

// Old case-study addresses (Phase 0) still work. The demo scenario in the query is kept.
const OLD_SUBPAGES: Record<string, string> = {
  funds: '/funds',
  activity: '/activity',
  practice: '/practice',
  learn: '/learn',
  attention: '/alerts',
  why: '/',
}
function oldPath(rest: string | string[] | undefined): string {
  const [first, ...more] = ([] as string[]).concat(rest ?? []).filter(Boolean)
  const base = first ? OLD_SUBPAGES[first] : undefined
  return base ? [base === '/' ? '' : base, ...more].join('/') || '/' : '/'
}

const routes: RouteRecordRaw[] = [
  { path: '/about', redirect: (to) => ({ path: '/', query: to.query }) },
  { path: '/p301/:rest(.*)*', redirect: (to) => ({ path: oldPath(to.params.rest), query: to.query, hash: to.hash }) },
  { path: '/p302/:rest(.*)*', redirect: (to) => ({ path: '/story', query: to.query, hash: to.hash }) },
  { path: '/p303/:rest(.*)*', redirect: (to) => ({ path: oldPath(to.params.rest), query: to.query, hash: to.hash }) },
  app,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (to, _from, saved) => saved ?? (to.hash ? { el: to.hash } : { top: 0 }),
})

// Scenarios are reached by URL only, so ?scenario= rides along on every in-app link.
router.beforeEach((to, from) => {
  if (from.query.scenario !== undefined && to.query.scenario === undefined) {
    return { path: to.path, query: { ...to.query, scenario: from.query.scenario }, hash: to.hash }
  }
  return true
})

// Each page gets its own title, so tabs and screen readers can tell them apart.
router.afterEach((to) => {
  const t = to.meta.title as string | undefined
  document.title = t && t !== 'Home' ? `${t} · First Leaf` : 'First Leaf'
})

export default router
