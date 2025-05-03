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
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/station',
      name: 'station',
      component: StationView,
    },
    {
      path: '/notifications',
      name: 'notification',
      component: Notification,
    },
    {
      path: '/aquasis',
      name: 'aquasis',
      component: AquasisView,
    },
    {
      path: '/aquabon',
      name: 'aquabon',
      component: AquabonView,
    },
    {
      path: '/coldpoint',
      name: 'coldpoint',
      component: ColdpointView,
    },
    {
      path: '/waterdrops',
      name: 'waterdrops',
      component: WaterdropsView,
    },
    {
      path: '/order',
      name: 'order',
      component: OrderPage,
    },

    {
      path: '/MyAccount',
      name: 'Myaccount',
      component: MyAccountView,
    },

    {
      path: '/addresses',
      name: 'addresses',
      component: AddressesView,
    },

    {
      path: '/calendarorder',
      name: 'calendarorder',
      component: CalendarOrderView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileInfoPage,
    },
  ],
})

export default router
