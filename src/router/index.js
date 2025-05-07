import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/supabase'
import LoginPage from '@/views/LoginPage.vue'
import HomeView from '@/views/HomeView.vue'
import StationView from '@/views/StationView.vue'
import Notification from '@/views/NotificationView.vue'
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
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  try {
    const { data } = await supabase.auth.getSession() //{ data, error }
    const isAuthenticated = !!data.session

    if (requiresAuth && !isAuthenticated) {
      // If the route requires login and user is not authenticated
      return next({ name: 'login' })
    }

    if (to.name === 'login' && isAuthenticated) {
      // Prevent logged-in users from accessing login page
      return next({ name: 'home' })
    }

    // Allow navigation
    return next()
  } catch (e) {
    console.error('Navigation error:', e)
    // In case of error (e.g., Supabase fails), redirect to login to be safe
    return next({ name: 'login' })
  }
})

export default router
