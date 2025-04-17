import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import calendar from '@/views/calendar.vue'
import HomeView from '@/views/HomeView.vue'


const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: calendar,
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
