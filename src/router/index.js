import { createRouter, createWebHistory } from 'vue-router'
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
  ],
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Function to check if user is logged in
  const isLoggedIn = () => {
    // Check if auth token exists in localStorage
    return localStorage.getItem('authToken') !== null
  }

  // If route requires auth and user is not logged in, redirect to login page
  if (requiresAuth && !isLoggedIn()) {
    next({ name: 'login' })
  } else {
    // If user is logged in and tries to access login page, redirect to home
    if (to.name === 'login' && isLoggedIn()) {
      next({ name: 'home' })
    } else {
      // Otherwise proceed as normal
      next()
    }
  }
})

export default router
