import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import HomeView from '@/features/home/HomeView.vue'
import layoutCopy from '@/layouts/copy.json'
import { isEmbedded, isWide, phoneViewPath, type PhoneRouteMessage } from '@/layouts/usePhonePreview'
import { fill } from '@/shared/copy'

const PT = layoutCopy.pageTitles

// One app (BRIEF.md §3, §7). The router wires the layout to each feature's pages.
// The layout and Home load with the first screen; every other page is lazy.
const app: RouteRecordRaw = {
  path: '/',
  component: AppLayout,
  children: [
    { path: '', name: 'home', component: HomeView, meta: { title: PT.home } },
    { path: 'alerts', component: () => import('@/features/alerts/AlertsView.vue'), meta: { title: PT.alerts } },
    { path: 'alerts/:id', component: () => import('@/features/alerts/AlertsView.vue'), meta: { title: PT.alerts } },
    { path: 'activity', component: () => import('@/features/activity/ActivityView.vue'), meta: { title: PT.activity } },
    { path: 'activity/:id', component: () => import('@/features/activity/ActivityDetail.vue'), meta: { title: PT.activity } },
    { path: 'funds', component: () => import('@/features/funds/FundsView.vue'), meta: { title: PT.funds } },
    { path: 'funds/:ticker', component: () => import('@/features/funds/FundView.vue'), meta: { title: PT.funds } },
    { path: 'story', component: () => import('@/features/story/StoryView.vue'), meta: { title: PT.story } },
    { path: 'practice', component: () => import('@/features/practice/PracticeView.vue'), meta: { title: PT.practice } },
    { path: 'learn', component: () => import('@/features/learn/LearnView.vue'), meta: { title: PT.learn } },
    { path: 'learn/:termId', component: () => import('@/features/learn/TermView.vue'), meta: { title: PT.learn } },
    { path: ':pathMatch(.*)*', name: 'not-found', component: () => import('@/features/not-found/NotFoundView.vue'), meta: { title: PT.notFound } },
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
  // Phone view (P303 brief): only the phone, in its own layout, at 600px and wider.
  // On a phone there is no frame, so /p303/… opens the page itself.
  {
    path: '/p303/:rest(.*)*',
    component: () => import('@/layouts/PhoneOnlyLayout.vue'),
    // The window title follows the page inside the phone (PhoneOnlyLayout sets it).
    meta: { phoneView: true },
    beforeEnter: (to) => {
      const rest = ([] as string[]).concat(to.params.rest ?? []).filter(Boolean)
      // Phase 0 phone addresses (/p303/attention, /p303/why) map to today's pages.
      const inner = rest[0] === 'attention' || rest[0] === 'why' ? oldPath(rest) : '/' + rest.join('/')
      if (!isWide() || isEmbedded) return { path: inner, query: to.query, hash: to.hash }
      return inner === '/' + rest.join('/') ? true : { path: phoneViewPath(inner), query: to.query, hash: to.hash }
    },
  },
  app,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // A #chapter link lands below the sticky top bar (and the tablet's tabs), not under it.
  scrollBehavior: (to, _from, saved) => saved ?? (to.hash ? { el: to.hash, top: 128 } : { top: 0 }),
})

// Scenarios are reached by URL only, so ?scenario= rides along on every in-app link.
router.beforeEach((to, from) => {
  // Phase 1–3 links to the phone preview (?view=phone) open phone view.
  if (to.query.view === 'phone') {
    const query = { ...to.query }
    delete query.view
    return { path: phoneViewPath(to.path), query, hash: to.hash }
  }
  if (from.query.scenario !== undefined && to.query.scenario === undefined) {
    return { path: to.path, query: { ...to.query, scenario: from.query.scenario }, hash: to.hash }
  }
  return true
})

// Each page gets its own title, so tabs and screen readers can tell them apart.
router.afterEach((to) => {
  if (to.meta.phoneView) return
  const t = to.meta.title as string | undefined
  document.title = t && t !== PT.home ? fill(layoutCopy.documentTitle, { page: t }) : layoutCopy.wordmark
  // Inside phone view's frame, tell the page around it where the phone is now.
  if (isEmbedded && window.parent !== window) {
    const query: Record<string, string> = {}
    for (const [k, v] of Object.entries(to.query)) if (k !== 'embed' && typeof v === 'string') query[k] = v
    const msg: PhoneRouteMessage = { type: 'fl-phone-route', path: to.path, query, hash: to.hash, title: document.title }
    window.parent.postMessage(msg, window.location.origin)
  }
})

export default router
