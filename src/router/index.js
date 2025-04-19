import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import HomeView from '@/views/HomeView.vue'
import StationView from '@/views/StationView.vue'
import Notification from '@/views/Notification.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
  ],
})

export default router
