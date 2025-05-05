import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/supabase'
import LoginPage from '@/views/LoginPage.vue'
import HomeView from '@/views/HomeView.vue'
import StationView from '@/views/StationView.vue'
import Notification from '@/views/Notification.vue'
import AquasisView from '@/views/system/AquasisView.vue'
import AquabonView from '@/views/system/AquabonView.vue'
import ColdpointView from '@/views/system/ColdpointView.vue'
import WaterdropsView from '@/views/system/WaterdropsView.vue'
import OrderPage from '@/views/OrderPage.vue'
import MyAccountView from '@/views/MyAccountView.vue'
import AddressesView from '@/views/system/AddressesView.vue'
import CalendarOrderView from '@/views/system/CalendarOrderView.vue'
import LandingPageView from '@/views/LandingPageView.vue'
import ProfileInfoPage from '@/views/system/ProfileInfoPage.vue'
import ForbiddenView from '@/views/error/ForbiddenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPageView,
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/station',
      name: 'station',
      component: StationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/notifications',
      name: 'notification',
      component: Notification,
      meta: { requiresAuth: true },
    },
    {
      path: '/aquasis',
      name: 'aquasis',
      component: AquasisView,
      meta: { requiresAuth: true },
    },
    {
      path: '/aquabon',
      name: 'aquabon',
      component: AquabonView,
      meta: { requiresAuth: true },
    },
    {
      path: '/coldpoint',
      name: 'coldpoint',
      component: ColdpointView,
      meta: { requiresAuth: true },
    },
    {
      path: '/waterdrops',
      name: 'waterdrops',
      component: WaterdropsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/order',
      name: 'order',
      component: OrderPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/MyAccount',
      name: 'Myaccount',
      component: MyAccountView,
      meta: { requiresAuth: true },
    },
    {
      path: '/addresses',
      name: 'addresses',
      component: AddressesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/calendarorder',
      name: 'calendarorder',
      component: CalendarOrderView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileInfoPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/:catchAll(.*)',
      name: 'forbidden',
      component: ForbiddenView,
    },
  ],
})

// Navigation guard
router.beforeEach(async (to, from) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Get current auth status from Supabase
  const { data } = await supabase.auth.getSession()
  const isAuthenticated = !!data.session

  // Route requires auth but user is not logged in
  if (requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  // User is logged in but trying to access login page
  if (to.name === 'login' && isAuthenticated) {
    return { name: 'home' }
  }

  return true
})

export default router
