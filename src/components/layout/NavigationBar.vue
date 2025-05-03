<template>
  <header :class="{ 'scrolled-nav': scrollPosition > 50 }">
    <nav>
      <div class="branding">
        <span class="first-word animate__fadeIn">E</span>
        <span class="second-word animate__fadeIn">-HYDRO</span>
      </div>
      <ul v-show="!mobile" class="navigation">
        <li v-for="(item, index) in navItems" :key="index" class="nav-item" :style="{ animationDelay: `${index * 0.1}s` }">
          <router-link class="link" :to="{ name: item.route }">{{ item.label }}</router-link>
        </li>
        <li class="notification-wrapper nav-item" :style="{ animationDelay: '0.3s' }">
          <v-icon class="second-last" @click="toggleNotifications" :class="{ 'bell-animation': hasNewNotifications }">mdi-bell</v-icon>
          <span v-if="hasNewNotifications" class="notification-badge">{{ notificationCount }}</span>
          <transition name="fade-dropdown">
            <div v-if="showNotifications" class="notification-dropdown">
              <div class="notification-header">Recently Received Notifications</div>
              <ul>
                <li v-for="(notification, i) in notifications" :key="i" class="notification-item">
                  <img :src="notification.icon" :alt="notification.alt" class="notif-icon" />
                  <div><strong>{{ notification.title }}</strong> {{ notification.text }}</div>
                </li>
              </ul>
              <div class="notification-footer">
                <router-link class="view-all" to="/notifications">View All</router-link>
              </div>
            </div>
          </transition>
        </li>
        <li class="profile-wrapper nav-item" :style="{ animationDelay: '0.4s' }">
          <v-icon class="last" @click="toggleProfileDropdown" :class="{ 'pulse': isProfileUpdated }">mdi-account-circle</v-icon>
          <transition name="fade-dropdown">
            <div v-if="showProfileDropdown" class="profile-dropdown">
              <div class="profile-info">
                <v-avatar size="70" color="deep-purple lighten-3" class="avatar-animation">
                  <template v-if="avatarUrl">
                    <img :src="avatarUrl" alt="User Image" class="profile-img" />
                  </template>
                  <template v-else>
                    <span class="text-h5 white--text">{{ initials || '??' }}</span>
                  </template>
                </v-avatar>
                <p class="username">{{ fullname }}</p>
                <p class="email">{{ userStore.email }}</p>
                <router-link class="edit-btn btn-hover-effect" to="/profile">Profile Info</router-link>
              </div>

              <ul>
                <li v-for="(item, i) in profileItems" :key="i" class="dropdown-item" :style="{ animationDelay: `${i * 0.1}s` }">
                  <router-link class="link" :to="item.route">
                    <v-icon class="small-icon">{{ item.icon }}</v-icon> {{ item.label }}
                  </router-link>
                </li>
              </ul>
            </div>
          </transition>
        </li>
      </ul>
      <!-- Mobile Nav Icon and Mobile Dropdown -->
      <v-icon
        class="icon-style"
        @click="toggleMobileNav"
        v-show="mobile"
        :class="{ 'icon-active': mobileNav }"
        >mdi-menu</v-icon
      >

      <transition name="mobile-nav">
        <ul v-show="mobile && mobileNav" class="dropdown-nav">
          <li>
            <div class="branding">
              <span class="first-word">E</span>
              <span class="second-word">-HYDRO</span>
            </div>
          </li>
          <li v-for="(item, index) in mobileNavItems" :key="index"
              class="mobile-nav-item"
              :style="{ animationDelay: `${index * 0.1}s` }">
            <router-link class="link" :to="{ name: item.route }">
              <v-icon>{{ item.icon }}</v-icon>{{ item.label }}
            </router-link>
          </li>
        </ul>
      </transition>
    </nav>
  </header>
  <slot name="content"></slot>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/supabase' // adjust path if needed

const userStore = useUserStore()

// --- Refs ---
const scrollPosition = ref(0)
const mobile = ref(null)
const mobileNav = ref(null)
const windowWidth = ref(window.innerWidth)
const showNotifications = ref(false)
const showProfileDropdown = ref(false)
const hasNewNotifications = ref(true)
const notificationCount = ref(3)
const isProfileUpdated = ref(false)

// --- Navigation Items ---
const navItems = [
  { label: 'Home', route: 'home' },
  { label: 'Station', route: 'station' },
  { label: 'My Order', route: 'order' }
]

const mobileNavItems = [
  { label: 'Home', route: 'home', icon: 'mdi-home' },
  { label: 'Station', route: 'station', icon: 'mdi-water' },
  { label: 'My Order', route: 'order', icon: 'mdi-cart' },
  { label: 'Notification', route: 'notification', icon: 'mdi-bell' },
  { label: 'Profile', route: '', icon: 'mdi-account' }
]

const profileItems = [
  { label: 'Settings', route: '/settings', icon: 'mdi-cogs' },
  { label: 'Logout', route: '/', icon: 'mdi-logout' }
]

// Sample notifications
const notifications = [
  {
    icon: '@/assets/img/icons/confirm.jpg',
    alt: 'Confirmed Icon',
    title: 'Order Confirmed:',
    text: 'Your order #12345 is confirmed.'
  },
  {
    icon: '@/assets/img/icons/galloon.png',
    alt: 'On the Way Icon',
    title: 'On the Way:',
    text: 'Your delivery is out.'
  },
  {
    icon: '@/assets/img/icons/voucher.png',
    alt: 'Discount Icon',
    title: 'Discount:',
    text: '10% voucher until March 30.'
  },
  {
    icon: '@/assets/img/icons/water.png',
    alt: 'New Station Icon',
    title: 'New Station:',
    text: 'We\'ve added one near you.'
  },
  {
    icon: '@/assets/img/icons/note.png',
    alt: 'Profile Icon',
    title: 'Profile Updated:',
    text: 'Info successfully saved.'
  }
]

// --- Auth User Data ---
const authUser = ref(null)
const avatarUrl = computed(() => {
  return userStore.avatarUrl || authUser.value?.user_metadata?.avatar_url || ''
})

const initials = computed(() => {
  const name = userStore.fullname || authUser.value?.user_metadata?.full_name
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }
  return 'U'
})

const fullname = computed(() => {
  return userStore.fullname || authUser.value?.user_metadata?.full_name || 'User'
})

// Handle scroll event for animations
const handleScroll = () => {
  scrollPosition.value = window.scrollY
}

// Fetch authenticated user on mount
onMounted(async () => {
  window.addEventListener('resize', checkScreen)
  window.addEventListener('scroll', handleScroll)
  checkScreen()

  // Simulate profile update after 5 seconds for demo
  setTimeout(() => {
    isProfileUpdated.value = true
    setTimeout(() => {
      isProfileUpdated.value = false
    }, 5000)
  }, 5000)

  const { data, error } = await supabase.auth.getUser()
  if (data?.user) {
    authUser.value = data.user
    console.log('Auth User:', data.user)
  } else {
    console.error('Auth error:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
  window.removeEventListener('scroll', handleScroll)
})

// --- Methods ---
function checkScreen() {
  windowWidth.value = window.innerWidth
  mobile.value = windowWidth.value <= 750
  if (!mobile.value) {
    mobileNav.value = false
  }
}

function toggleMobileNav() {
  mobileNav.value = !mobileNav.value
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showProfileDropdown.value = false

  // Clear notification badge when opened
  if (showNotifications.value) {
    hasNewNotifications.value = false
    notificationCount.value = 0
  }
}

function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value
  showNotifications.value = false
}

const handleLogout = () => {
  // Clear user data from Pinia and localStorage
  userStore.setUserData({
    email: '',
    fullname: '',
    mobile: '',
    avatar_url: '',
  })
  localStorage.removeItem('email')
  localStorage.removeItem('fullname')
  localStorage.removeItem('mobile')
  localStorage.removeItem('avatar_url')

  // Redirect to login page
  router.push('/login')
}
</script>

<style scoped>
/* Base Styles */
header {
  z-index: 99;
  width: 100%;
  position: fixed;
  transition: 0.5s ease all;
  color: #04448d;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

header.scrolled-nav {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.5s ease;
}

nav {
  display: flex;
  flex-direction: row;
  padding: 12px 0;
  transition: 0.5s ease all;
  width: 90%;
  margin: 0 auto;
  @media (min-width: 1140px) {
    max-width: 1140px;
  }
}

ul,
.link {
  font-weight: 400;
  font-family: 'Inter', sans-serif;
  color: #04448d;
  list-style: none;
  text-decoration: none;
}

li {
  padding: 16px;
  margin-left: 24px;
}

.nav-item {
  animation: fadeInDown 0.5s forwards;
  opacity: 0;
}

.mobile-nav-item {
  animation: fadeInRight 0.5s forwards;
  opacity: 0;
}

.dropdown-item {
  animation: fadeInUp 0.3s forwards;
  opacity: 0;
}

.notification-item:hover {
  background-color: rgba(2, 173, 239, 0.05);
  border-radius: 8px;
  transform: translateX(5px);
  transition: all 0.3s ease;
}

.last,
.second-last {
  margin-left: -2.7rem !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.last:hover,
.second-last:hover {
  transform: scale(1.1);
  color: #02adef;
}

.last {
  font-size: 36px;
  border-style: none;
}

.second-last {
  font-size: 32px;
  border-style: none;
}

/* Link Styles with Animation */
.link {
  font-size: 18px;
  transition: 0.3s ease all;
  border-bottom: 1px solid transparent;
  position: relative;
}

.link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #02adef;
  visibility: hidden;
  transition: all 0.3s ease;
}

.link:hover {
  color: #02adef;
}

.link:hover::after {
  visibility: visible;
  width: 100%;
}

/* Branding Animations */
.branding {
  display: flex;
  align-items: center;
}

.first-word,
.second-word {
  font-weight: 500;
  font-size: 53px;
  transition: 0.5s ease all;
  font-family: 'Antonio', sans-serif;
  animation-duration: 1s;
}

.first-word {
  color: #02adef;
}

.second-word {
  color: #04448d;
}

.animate__fadeIn {
  animation: fadeIn 1.5s;
}

/* Navigation */
.navigation {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

/* Notification Badge */
.notification-badge {
  position: absolute;
  top: 10px;
  right: 20px;
  background-color: rgba(255, 71, 87, 0.9);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
  backdrop-filter: blur(3px);
}

/* Bell Animation */
.bell-animation {
  animation: bell-shake 2s infinite ease-in-out;
}

@keyframes bell-shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(8deg);
  }
  50% {
    transform: rotate(-8deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

/* Profile Animation */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(2, 173, 239, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(2, 173, 239, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(2, 173, 239, 0);
  }
}

/* Mobile Menu Icon */
.icon-style {
  font-size: 30px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 24px;
  height: 100%;
  margin-top: 4px;
  cursor: pointer;
  transition:
    transform 0.5s ease,
    opacity 0.4s ease;
}

.icon-style.icon-active {
  transform: rotate(180deg);
  color: #02adef;
}

/* Mobile Nav Dropdown */
.dropdown-nav {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 90%;
  max-width: 250px;
  height: 100%;
  backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.3);
  left: 0;
  top: 0;
  margin: auto;
  padding: 12px 0;
  box-shadow: 5px 0 25px rgba(0, 0, 0, 0.07);
  border-right: 1px solid rgba(238, 238, 238, 0.2);
}

.dropdown-nav li {
  margin-left: 0;
}

.dropdown-nav .link {
  color: #04448d;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Notification Dropdown */
.notification-wrapper {
  position: relative;
}

.notification-dropdown {
  position: absolute;
  right: 0;
  top: 60px;
  width: 350px;
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(238, 238, 238, 0.3);
  border-radius: 12px;
  padding: 15px;
  z-index: 999;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  color: #04448d;
  transform-origin: top right;
  backdrop-filter: blur(10px);
}

.notification-dropdown::before {
  content: '';
  position: absolute;
  top: -10px;
  right: 21px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid rgba(255, 255, 255, 0.7);
}

.notification-dropdown ul {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
  max-height: 300px;
  overflow-y: auto;
}

.notification-dropdown ul::-webkit-scrollbar {
  width: 5px;
}

.notification-dropdown ul::-webkit-scrollbar-thumb {
  background: #02adef;
  border-radius: 10px;
}

.notification-dropdown ul li {
  font-size: 14px;
  margin-bottom: 5px;
  display: flex;
  gap: 10px;
  text-align: left;
  padding: 12px 16px;
  margin: 0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.notification-header {
  font-size: 14px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(238, 238, 238, 0.3);
  color: rgba(4, 68, 141, 0.8);
  font-weight: 600;
}

.notification-footer {
  border-top: 1px solid rgba(238, 238, 238, 0.3);
  padding-top: 12px;
  margin-top: 10px;
  text-align: center;
}

.view-all {
  text-align: center;
  color: #02adef;
  font-weight: bold;
  cursor: pointer;
  padding: 8px 15px;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 20px;
  display: inline-block;
}

.view-all:hover {
  color: white;
  background-color: rgba(2, 173, 239, 0.8);
  text-decoration: none;
  backdrop-filter: blur(5px);
}

/* Profile Dropdown */
.profile-wrapper {
  position: relative;
}

.profile-dropdown {
  position: absolute;
  right: 0;
  top: 60px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 20px 15px;
  width: 290px;
  z-index: 999;
  transform-origin: top right;
  border: 1px solid rgba(238, 238, 238, 0.3);
  backdrop-filter: blur(10px);
}

.profile-dropdown::before {
  content: '';
  position: absolute;
  top: -10px;
  right: 31px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid rgba(255, 255, 255, 0.7);
}

.profile-dropdown ul {
  padding: 0;
  margin: 0;
}

.profile-dropdown ul li {
  padding: 10px 16px;
  margin: 0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.profile-dropdown ul li:hover {
  background-color: rgba(2, 173, 239, 0.15);
}

.notif-icon {
  width: 30px;
  height: 32px;
  object-fit: contain;
  margin-top: 2px;
}

.router-link-exact-active {
  color: #02adef;
}

.router-link-exact-active::after {
  visibility: visible;
  width: 100%;
  background-color: #02adef;
}

/* Profile Info Section */
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(238, 238, 238, 0.3);
  width: 90%;
  margin: 0 auto 15px;
}

.avatar-animation {
  transition: all 0.3s ease;
}

.avatar-animation:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(2, 173, 239, 0.3);
}

.profile-img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
  border: 3px solid #02adef;
  transition: all 0.3s ease;
}

.username {
  font-weight: bold;
  color: #04448d;
  margin-bottom: 5px;
  font-size: 16px;
}

.email {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.edit-btn {
  background-color: rgba(2, 173, 239, 0.8);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  margin-top: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(2, 173, 239, 0.2);
  backdrop-filter: blur(5px);
}

.btn-hover-effect:hover {
  background-color: rgba(4, 68, 141, 0.8);
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(2, 173, 239, 0.3);
}

.small-icon {
  font-size: 19px;
  margin-right: 10px;
}

/* Dropdown Animation */
.fade-dropdown-enter-active,
.fade-dropdown-leave-active {
  transition: all 0.3s ease;
}

.fade-dropdown-enter-from,
.fade-dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Mobile Nav Animation */
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* General Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
