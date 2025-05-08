<template>
  <header :class="{ 'scrolled-nav': scrollPosition }">
    <nav>
      <div class="branding">
        <span class="first-word">E</span>
        <span class="second-word">-HYDRO</span>
      </div>
      <ul v-show="!mobile" class="navigation">
        <li><router-link class="nav-link" :to="{ name: 'home' }">Home</router-link></li>
        <li><router-link class="nav-link" :to="{ name: 'station' }">Station</router-link></li>
        <li><router-link class="nav-link" :to="{ name: 'order' }">My Order</router-link></li>
        <li class="notification-wrapper">
          <v-icon class="second-last" @click="toggleNotifications">mdi-bell</v-icon>
          <!-- Show notification badge if there are notifications -->
          <div v-if="hasNotifications" class="notification-badge">{{ notificationCount }}</div>
          <div v-if="showNotifications" class="notification-dropdown">
            <div class="notification-header">Recently Received Notifications</div>
            <div v-if="orderNotifications.length === 0" class="no-notifications">
              <v-icon>mdi-bell-off-outline</v-icon>
              <p>No new notifications</p>
            </div>
            <ul v-else>
              <!-- Order Status Notifications -->
              <li
                v-for="(notification, index) in limitedNotifications"
                :key="notification.id || index"
                :class="[notification.isNew ? 'new-notification' : '', notification.type]"
              >
                <v-icon :class="['notif-icon', notification.type + '-icon']">{{
                  getNotificationIcon(notification.type)
                }}</v-icon>
                <div>
                  <strong>{{ notification.title }}</strong> {{ notification.message }}
                  <span class="timestamp">{{ notification.timestamp }}</span>
                </div>
              </li>
            </ul>
            <div class="notification-footer">
              <router-link class="view-all" to="/notifications">View All</router-link>
            </div>
            <div
              v-if="orderNotifications.length > MAX_NAVBAR_NOTIFICATIONS"
              class="more-notifications"
            >
              <router-link class="view-all" to="/notifications">
                +{{ orderNotifications.length - MAX_NAVBAR_NOTIFICATIONS }} more...
              </router-link>
            </div>
          </div>
        </li>
        <li class="profile-wrapper">
          <v-avatar
            size="45"
            color="deep-purple lighten-3"
            class="profile-initials last"
            @click="toggleProfileDropdown"
          >
            <template v-if="avatarUrl">
              <img :src="avatarUrl" alt="User Image" class="profile-img" />
            </template>
            <template v-else>
              <span class="white--text text-subtitle-2">{{ initials || '??' }}</span>
            </template>
          </v-avatar>
          <div v-if="showProfileDropdown" class="profile-dropdown">
            <div class="profile-info">
              <v-avatar size="70" color="deep-purple lighten-3" class="profile-initials">
                <template v-if="avatarUrl">
                  <img :src="avatarUrl" alt="User Image" class="profile-img" />
                </template>
                <template v-else>
                  <span class="text-h5 white--text">{{ initials || '??' }}</span>
                </template>
              </v-avatar>
              <p class="username">{{ fullname }}</p>

              <p class="email">{{ userStore.email }}</p>
              <router-link class="edit-btn" to="/profile">View Profile</router-link>
            </div>

            <ul>
              <li>
                <router-link class="profile-link" to="/MyAccount">
                  <v-icon class="edit-icon small-icon">mdi-account</v-icon>
                  Edit Profile
                </router-link>
              </li>
              <li>
                <router-link class="profile-link" to="/addresses">
                  <v-icon class="address-icon small-icon">mdi-map-marker</v-icon> Delivery Address
                </router-link>
              </li>

              <li>
                <a href="#" class="profile-link" @click.prevent="handleLogout">
                  <v-icon class="logout-icon small-icon">mdi-logout</v-icon> Logout
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <!-- Mobile Hamburger Menu - Using Sidebar Style -->
      <div
        class="hamburger-container"
        v-if="mobile"
        style="position: absolute; top: 10px; right: 10px; z-index: 100"
      >
        <v-btn
          icon
          :color="isMobileMenuOpen ? 'red darken-2' : 'primary'"
          @click="toggleMobileMenu"
          class="hamburger-btn"
          aria-label="Toggle menu"
        >
          <v-icon large>{{ isMobileMenuOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
        </v-btn>
      </div>

      <!-- Overlay for mobile menu -->
      <div v-if="mobile && isMobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>

      <!-- Mobile Sidebar Menu -->
      <v-row
        class="profile-card-wrapper"
        :class="{ 'mobile-menu-open': isMobileMenuOpen }"
        :style="{
          position: 'fixed',
          top: '0',
          left: 0,
          height: '100vh',
          margin: 0,
          zIndex: 100,
          width: '250px',
          transform: mobile && !isMobileMenuOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease-in-out',
        }"
        v-if="mobile"
      >
        <v-col style="padding: 0">
          <v-card
            hover
            :style="{
              background: '#FFFFFF',
              borderRadius: '0',
              boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
              height: '100%',
            }"
            class="animated-card profile-card"
          >
            <v-card-item class="pa-4">
              <div class="d-flex flex-column align-center mt-3 profile-content">
                <v-avatar
                  color="#0a8fe7"
                  size="115"
                  class="avatar-animate mb-1"
                  :style="{
                    border: '3px solid #0a8fe7',
                    boxShadow: '0 0 15px rgba(126, 87, 194, 0.5)',
                  }"
                >
                  <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                  <p v-else class="text-h5 initials-animate">{{ initials || '??' }}</p>
                </v-avatar>

                <div class="d-flex flex-column align-center profile-info text-center">
                  <span class="profile-name text-h6 font-weight-bold">
                    {{ fullname }}
                  </span>
                  <span class="profile-email text-caption mb-3">
                    <v-icon small class="mr-1">mdi-email</v-icon>
                    {{ userStore.email }}
                  </span>
                </div>
              </div>
            </v-card-item>

            <v-card-text class="pt-0 pb-4">
              <!-- Loop through each navigation item -->
              <div
                v-for="(link, index) in profileLinks"
                :key="index"
                class="link-item"
                :style="{ animationDelay: `${0.2 + index * 0.1}s` }"
              >
                <!-- Dropdown item (My Account) -->
                <template v-if="link.children">
                  <div class="sidebar-link d-flex align-center" @click="toggleDropdown(index)">
                    <v-icon small class="mr-2">{{ link.icon || 'mdi-account' }}</v-icon>
                    <span>{{ link.text }}</span>
                    <v-spacer />
                    <v-icon small>
                      {{ openDropdown === index ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                    </v-icon>
                  </div>

                  <!-- Dropdown children -->
                  <div
                    v-if="openDropdown === index"
                    class="ml-4 mt-1"
                    style="transition: all 0.3s ease"
                  >
                    <router-link
                      v-for="sublink in link.children"
                      :key="sublink.route"
                      :to="{ name: sublink.route }"
                      class="sidebar-link d-flex align-center"
                      :class="{ 'active-sidebar-link': $route.name === sublink.route }"
                    >
                      <v-icon small class="mr-2">mdi-chevron-right</v-icon>
                      {{ sublink.text }}
                    </router-link>
                  </div>
                </template>

                <!-- Regular menu item -->
                <template v-else>
                  <router-link
                    :to="{ name: link.route }"
                    class="sidebar-link d-flex align-center"
                    :class="{ 'active-sidebar-link': $route.name === link.route }"
                  >
                    <v-icon small class="mr-2">{{ getLinkIcon(link.route) }}</v-icon>
                    <span>{{ link.text }}</span>
                    <v-spacer />
                    <v-icon small>mdi-chevron-right</v-icon>
                  </router-link>
                </template>
              </div>
              <!-- Logout Button -->
              <v-divider class="my-3"></v-divider>
              <div
                class="link-item logout-button"
                :style="{ animationDelay: `${0.2 + profileLinks.length * 0.1}s` }"
              >
                <div
                  class="sidebar-link d-flex align-center"
                  @click="handleLogout"
                  style="cursor: pointer"
                >
                  <v-icon small class="mr-2">mdi-logout</v-icon>
                  <span>Logout</span>
                  <v-spacer />
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </nav>
  </header>
  <slot name="content"></slot>

  <!-- Toast Notification for New Order Status Updates -->
  <div v-if="showToast" class="status-toast" :class="toastType">
    <div class="toast-content">
      <v-icon class="toast-icon">{{ toastIcon }}</v-icon>
      <div class="toast-message">{{ toastMessage }}</div>
    </div>
    <v-btn icon small class="close-toast" @click="hideToast">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </div>

  <!-- Loading Screen Component -->
  <LoadingPage :show="isLoggingOut" :duration="2000" @loading-complete="completeLogout" />
</template>

<script setup>
// Combined imports from both components
import { onMounted, onUnmounted, ref, computed, provide } from 'vue'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/orders'
import { supabase } from '@/supabase'
import { useRouter } from 'vue-router'
import LoadingPage from '@/components/layout/LoadingPage.vue'

const userStore = useUserStore()
const orderStore = useOrderStore()
const router = useRouter()

// --- Refs ---
const mobile = ref(null)
const windowWidth = ref(window.innerWidth)
const showNotifications = ref(false)
const showProfileDropdown = ref(false)
const isLoggingOut = ref(false)

// New mobile menu refs from sidebar component
const isMobileMenuOpen = ref(false)
const openDropdown = ref(null)

// --- Auth User Data ---
const authUser = ref(null)
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

const avatarUrl = computed(() => {
  return userStore.avatar_url || authUser.value?.user_metadata?.avatar_url || ''
})

// --- Notification System ---
const orderNotifications = ref([])
const notificationCount = computed(() => orderNotifications.value.filter((n) => n.isNew).length)
const hasNotifications = computed(() => notificationCount.value > 0)

// Toast notification system
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('info')
const toastIcon = ref('mdi-information')
const toastTimeout = ref(null)

// Profile links from sidebar
const profileLinks = [
  { route: 'home', text: 'Home' },
  { route: 'station', text: 'Station' },
  { route: 'order', text: 'My Orders' },
  {
    text: 'My Account',
    icon: 'mdi-account',
    children: [
      { route: 'profile', text: 'View Profile' },
      { route: 'notification', text: 'Notifications' },
      { route: 'addresses', text: 'My Address' },
    ],
  },
]

// For notifications
const MAX_NAVBAR_NOTIFICATIONS = 7
const allNotifications = ref([])

// Computed property to return only the first few notifications for the navbar
const limitedNotifications = computed(() => {
  return orderNotifications.value.slice(0, MAX_NAVBAR_NOTIFICATIONS)
})

// Scroll position ref to track whether we've scrolled
const scrollPosition = ref(false)

// --- Methods ---

// Toggle mobile menu (from sidebar)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu when clicking outside (from sidebar)
const closeMobileMenu = () => {
  if (mobile.value && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

// Toggle dropdown for sidebar menu
const toggleDropdown = (index) => {
  openDropdown.value = openDropdown.value === index ? null : index
}

function checkScreen() {
  windowWidth.value = window.innerWidth
  mobile.value = windowWidth.value <= 750
  if (!mobile.value) {
    isMobileMenuOpen.value = false
  }
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showProfileDropdown.value = false

  // Mark notifications as read when opened
  if (showNotifications.value) {
    orderNotifications.value = orderNotifications.value.map((notif) => ({
      ...notif,
      isNew: false,
    }))
  }
}

function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value
  showNotifications.value = false
}

// Function to show toast notification
function showStatusToast(message, type = 'info') {
  toastMessage.value = message
  toastType.value = type

  // Set icon based on type
  switch (type) {
    case 'success':
      toastIcon.value = 'mdi-check-circle'
      break
    case 'warning':
      toastIcon.value = 'mdi-alert'
      break
    case 'error':
      toastIcon.value = 'mdi-alert-circle'
      break
    default:
      toastIcon.value = 'mdi-information'
  }

  showToast.value = true

  // Auto-hide after 5 seconds
  if (toastTimeout.value) clearTimeout(toastTimeout.value)
  toastTimeout.value = setTimeout(() => {
    hideToast()
  }, 5000)
}

function hideToast() {
  showToast.value = false
}

// Get appropriate icon based on notification type
function getNotificationIcon(type) {
  switch (type) {
    case 'progress':
      return 'mdi-truck-delivery'
    case 'cancelled':
      return 'mdi-cancel'
    case 'completed':
      return 'mdi-check-circle'
    default:
      return 'mdi-bell'
  }
}

// Get icon for sidebar links
const getLinkIcon = (route) => {
  const icons = {
    home: 'mdi-home',
    station: 'mdi-storefront',
    order: 'mdi-package-variant',
    profile: 'mdi-account',
    addresses: 'mdi-map-marker',
  }
  return icons[route] || 'mdi-link'
}

// For real-time order status updates
let orderSubscription = null

// Enhanced subscription with improved order status tracking
function setupOrderStatusListener(userId) {
  if (!userId) return

  // Clean up any existing subscription
  if (orderSubscription) orderSubscription.unsubscribe()

  // Subscribe to order changes for this user
  orderSubscription = supabase
    .channel('orders-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Order status change detected:', payload)

        // Handle different events
        if (payload.eventType === 'INSERT') {
          // New order created
          if (payload.new.status === 'To Deliver' || payload.new.status === 'Processing') {
            addNotification(
              'progress',
              'Order In Progress',
              `Your order #${payload.new.id} is now being prepared for delivery.`,
            )
          }
        } else if (payload.eventType === 'UPDATE') {
          // Order status updated
          const oldStatus = payload.old.status
          const newStatus = payload.new.status

          console.log(`Order #${payload.new.id} status changed from ${oldStatus} to ${newStatus}`)

          // Handle status changes - specifically check for cancellation
          if (newStatus === 'Cancelled') {
            console.log('Creating cancellation notification')
            addNotification(
              'cancelled',
              'Order Cancelled',
              `Your order #${payload.new.id} has been cancelled. Please contact customer support for assistance.`,
            )
          } else if (newStatus === 'Completed') {
            addNotification(
              'completed',
              'Order Completed',
              `Your order #${payload.new.id} has been successfully delivered. Thank you for using E-HYDRO!`,
            )
          } else if (newStatus === 'To Deliver') {
            addNotification(
              'progress',
              'Order In Progress',
              `Your order #${payload.new.id} is now ready for delivery and will arrive shortly.`,
            )
          } else if (newStatus === 'Processing') {
            addNotification(
              'progress',
              'Order In Progress',
              `Your order #${payload.new.id} is now being processed. We'll update you when it's ready for delivery.`,
            )
          }
        }
      },
    )
    .subscribe((status) => {
      console.log('Subscription status:', status)
    })

  console.log('Order status subscription established for user:', userId)
}

// Fetch initial order notifications and set up listener
async function fetchInitialNotifications() {
  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return

    const userId = userData.user.id

    // Fetch recent orders to initialize notifications
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching recent orders:', error)
      return
    }

    // Initialize notifications from orders
    orderNotifications.value = data.map((order) => {
      let type = 'info'
      let title = 'Order Status'
      let message = ''

      if (order.status === 'Processing') {
        type = 'progress'
        title = 'Order In Progress'
        message = `Your order #${order.id} is being processed. We'll update you when it's ready for delivery.`
      } else if (order.status === 'To Deliver') {
        type = 'progress'
        title = 'Order In Progress'
        message = `Your order #${order.id} is ready for delivery and will arrive shortly.`
      } else if (order.status === 'Completed') {
        type = 'completed'
        title = 'Order Completed'
        message = `Your order #${order.id} has been successfully delivered. Thank you for using E-HYDRO!`
      } else if (order.status === 'Cancelled') {
        type = 'cancelled'
        title = 'Order Cancelled'
        message = `Your order #${order.id} has been cancelled. Please contact customer support for assistance.`
      }

      return {
        type,
        title,
        message,
        timestamp: new Date(order.created_at).toLocaleString(),
        isNew: order.status === 'To Deliver' || order.status === 'Processing',
        id: order.id,
      }
    })

    // Set up real-time listener for this user
    setupOrderStatusListener(userId)
  } catch (err) {
    console.error('Failed to fetch initial notifications:', err)
  }
}

// Fetch in-progress orders for the current user
async function fetchInProgressOrders(userId) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, status')
      .eq('user_id', userId)
      .in('status', ['To Deliver', 'Processing'])

    if (error) {
      console.error('Error fetching in-progress orders:', error)
      return
    }

    // Update the order store with the count of in-progress orders
    orderStore.setInProgressOrdersCount(data.length)
  } catch (err) {
    console.error('Failed to fetch in-progress orders:', err)
  }
}

// Update scroll position based on window scroll
function updateScroll() {
  // If scrolled more than 50px, set scrollPosition to true
  scrollPosition.value = window.scrollY > 50
}

// Modified addNotification function
function addNotification(type, title, message) {
  console.log(`Adding ${type} notification: ${title}`)

  // Create notification object
  const notification = {
    type,
    title,
    message,
    timestamp: 'Just now',
    isNew: true,
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  }

  // Add to beginning of array
  orderNotifications.value.unshift(notification)

  // Also update the allNotifications array for sharing with notification page
  allNotifications.value.unshift(notification)

  console.log('Current notifications:', orderNotifications.value.length)

  // Show toast notification
  let toastType = 'info'
  if (type === 'completed') toastType = 'success'
  if (type === 'cancelled') toastType = 'error'
  if (type === 'progress') toastType = 'info'

  showStatusToast(`${title}: ${message}`, toastType)
}

// Modified logout function with loading screen
function handleLogout() {
  console.log('Logout initiated')

  // Show loading screen first
  isLoggingOut.value = true

  // The actual logout process will be triggered by the loading-complete event
}

// 2. Function that completes the logout after loading animation
async function completeLogout() {
  try {
    console.log('Completing logout process')

    // Clear user data from store
    userStore.clearUserData()

    // Clean up any Supabase subscription
    if (orderSubscription) {
      orderSubscription.unsubscribe()
    }

    // Clear notifications
    orderNotifications.value = []
    allNotifications.value = []

    // Sign out using Supabase
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error during logout:', error)
      isLoggingOut.value = false
      return
    }

    console.log('Successfully logged out, redirecting to login')

    // Explicitly force navigation to login page
    window.location.href = '/login' // Use direct location redirect instead of router.push

    // If you prefer using router (comment out the line above and uncomment this)
    // router.push({ name: 'login', replace: true })
  } catch (err) {
    console.error('Logout completion failed:', err)
    isLoggingOut.value = false
  }
}

// Provide notifications to other components
provide('allNotifications', allNotifications)
provide('orderNotifications', orderNotifications)

// Lifecycle hooks
onMounted(async () => {
  window.addEventListener('resize', checkScreen)
  window.addEventListener('scroll', updateScroll)
  checkScreen()
  updateScroll()

  const { data, error } = await supabase.auth.getUser()
  if (data?.user) {
    authUser.value = data.user
    console.log('Auth User:', data.user)

    // Try to fetch user profile if not already loaded
    if (!userStore.fullname || !userStore.avatar_url) {
      userStore.fetchUserProfile()
    }

    // Fetch in-progress orders
    await fetchInProgressOrders(data.user.id)

    // Fetch initial notifications
    await fetchInitialNotifications()
  } else {
    console.error('Auth error:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
  window.removeEventListener('scroll', updateScroll)

  // Clean up Supabase subscription
  if (orderSubscription) {
    orderSubscription.unsubscribe()
  }

  // Clear any toast timeout
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
  }
})
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  transition: all 0.5s ease;
  background-color: transparent;
  height: 80px;
}

header.scrolled-nav {
  background: linear-gradient(120deg, #0557b6, #011c3a, #0557b6);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 75px;
}

header.scrolled-nav nav {
  padding: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

header.scrolled-nav .first-word,
header.scrolled-nav .second-word {
  font-size: 35px;
}

header nav .navigation .router-link-exact-active {
  color: #02adef !important;
  border-bottom: 1px solid #02adef;
}

nav {
  display: flex;
  flex-direction: row;
  padding: 12px 0;
  justify-content: space-between;
  align-items: center;
  transition: all 0.5s ease;
  width: 90%;
  margin: 0 auto;
  @media (min-width: 1140px) {
    max-width: 1140px;
  }
}

/* Bell icon animation */
@keyframes shake {
  0% {
    transform: rotate(0);
  }
  15% {
    transform: rotate(5deg);
  }
  30% {
    transform: rotate(-5deg);
  }
  45% {
    transform: rotate(4deg);
  }
  60% {
    transform: rotate(-4deg);
  }
  75% {
    transform: rotate(2deg);
  }
  85% {
    transform: rotate(-2deg);
  }
  92% {
    transform: rotate(1deg);
  }
  100% {
    transform: rotate(0);
  }
}

/* Apply shake on hover */
.second-last:hover {
  animation: shake 0.5s ease-in-out;
}

/* Notification bell with notifications class */
.has-notifications {
  animation: shake 0.8s ease-in-out;
  animation-iteration-count: infinite;
  animation-delay: 2s;
}

/* Pause animation when hovering */
.has-notifications:hover {
  animation: shake 0.5s ease-in-out;
  animation-iteration-count: 1;
  animation-delay: 0s;
}

ul {
  font-weight: 400;
  font-family: 'Inter', sans-serif;
  color: #04448d;
  list-style: none;
}

/* Main navigation link style */
.nav-link {
  font-weight: 400;
  font-family: 'Inter', sans-serif;
  color: #04448d;
  text-decoration: none;
  font-size: 18px;
  transition: 0.5s ease all;
  border-bottom: 1px solid transparent;
  margin-right: 20px;
}

.nav-link:hover {
  color: #02adef;
  border-color: #02adef;
}

/* Mobile sidebar link style */
.sidebar-link {
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.sidebar-link:hover {
  background-color: rgba(10, 143, 231, 0.1);
  color: #0a8fe7;
}

/* Profile dropdown link style */
.profile-link {
  color: #04448d !important;
  font-size: 16px;
  transition: 0.3s ease all;
  text-decoration: none;
}

.profile-link:hover {
  color: #02adef !important;
}

li {
  padding: 15px;
  margin-left: 27px;
}

.last,
.second-last {
  margin-left: -2.7rem !important;
}

.last {
  font-size: 36px;
  border-style: none;
}

.second-last {
  font-size: 32px;
  border-style: none;
}

.branding {
  display: flex;
  align-items: center;
}

.first-word,
.second-word {
  font-weight: 600;
  font-size: 53px;
  transition: 0.5s ease all;
  font-family: 'Antonio', sans-serif;
}

.first-word {
  color: #02adef;
}

.second-word {
  color: #04448d;
}

.navigation {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

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
}

.dropdown-nav {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 90%;
  max-width: 250px;
  height: 100%;
  backdrop-filter: blur(10px);
  left: 0;
  top: 0;
  margin: auto;
  padding: 12px 0;
}

.dropdown-nav li .nav-link {
  color: #04448d;
  font-size: 18px;
}

.notification-dropdown {
  position: absolute;
  right: 0;
  top: 58px;
  width: 350px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: #04448d;
  /* Fixed maximum height */
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.notification-dropdown::before {
  content: '';
  position: absolute;
  top: -10px;
  right: 30px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}

.notification-header {
  font-size: 14px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
  color: rgba(4, 68, 141, 0.5);
  /* Keep header fixed at top */
  flex: 0 0 auto;
}

/* This is the scrollable container for notifications */
.notification-dropdown ul {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
  /* Enable scrolling for this element only */
  overflow-y: auto;
  max-height: 300px;
  /* Add some spacing between items */
  margin-bottom: 0;
  /* For smoother scrolling on mobile */
  -webkit-overflow-scrolling: touch;
  /* Keep as much space as needed but allow shrinking */
  flex: 1 1 auto;
}

.notification-dropdown ul li {
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  text-align: left;
  padding: 12px 16px;
  margin: 0;
  /* Prevent text from overflowing */
  word-break: break-word;
}

.notification-footer {
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 10px;
  text-align: center;
  /* Keep footer fixed at bottom */
  flex: 0 0 auto;
}

/* Scrollbar styling for better appearance */
.notification-dropdown ul::-webkit-scrollbar {
  width: 6px;
}

.notification-dropdown ul::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.notification-dropdown ul::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.notification-dropdown ul::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.view-all {
  text-align: center;
  color: #02adef;
  font-weight: bold;
  cursor: pointer;
  padding-top: 5px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.view-all:hover {
  color: #007bbd;
  text-decoration: underline;
}

.profile-wrapper {
  position: relative;
}

.profile-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-dropdown ul li:last-child {
  border-bottom: none;
}

.profile-dropdown .profile-link:hover {
  color: #02adef;
}

.profile-dropdown {
  position: absolute;
  right: 0;
  top: 70px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 290px;
  z-index: 999;
}

.profile-dropdown::before {
  content: '';
  position: absolute;
  top: -10px;
  right: 30px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}

.profile-dropdown ul li {
  padding: 8px 16px;
  margin: 0;
}

.notif-icon {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

/* Notification icon colors */
.progress-icon {
  color: #2196f3;
}

.completed-icon {
  color: #4caf50;
}

.cancelled-icon {
  color: #f44336;
}

.router-link-exact-active {
  color: #02adef;
  border-bottom: 1px solid #02adef;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #ccc;
  width: 90%;
  margin: 0 auto 10px;
}

.profile-img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.username {
  font-weight: bold;
  color: #04448d;
  margin-bottom: 3px;
}

.edit-btn {
  background-color: #02adef;
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  margin-top: 8px;
}

.edit-btn:hover {
  background-color: #0198cb;
}

.small-icon {
  font-size: 20px;
}

.profile-initials {
  width: 60px;
  height: 60px;
  background-color: #4a90e2;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  border: 2px solid #0a8fe7;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.profile-initials:hover {
  transform: scale(0.95);
}

.profile-initials:active {
  transform: scale(0.9);
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 17px;
  background-color: #ff5252;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.mobile-notification-badge {
  background-color: #ff5252;
  color: white;
  border-radius: 50%;
  padding: 1px 6px;
  font-size: 12px;
  margin-left: 5px;
  font-weight: bold;
}

.notification-wrapper {
  position: relative;
}

.status-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 300px;
  max-width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideIn 0.3s ease-out;
}
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  font-size: 24px;
}

.toast-message {
  font-size: 14px;
  font-weight: 500;
}

.close-toast {
  margin-left: 8px;
}

/* Toast colors */
.status-toast.info {
  background-color: #e3f2fd;
  color: #0277bd;
}

.status-toast.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-toast.warning {
  background-color: #fff8e1;
  color: #ff8f00;
}

.status-toast.error {
  background-color: #ffebee;
  color: #c62828;
}

.new-notification {
  background-color: #f0f0f0; /* Light gray background for new notifications */
  border-left: 3px solid #6200ea; /* Purple accent for new notifications */
  transition: all 0.3s ease;
}

/* Notification item styling */
.notification-dropdown li {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notification-dropdown li:hover {
  background-color: #f5f5f5;
}

/* Timestamp styling */
.timestamp {
  display: block;
  font-size: 0.8rem;
  color: #757575;
  margin-top: 4px;
}

.scrolled-nav .v-icon {
  color: #ffffff !important;
}

/* Change brand colors when scrolled */
.scrolled-nav .first-word {
  color: #02b5fc;
}

.scrolled-nav .second-word {
  color: #ffffff;
}

.scrolled-nav .navigation li .nav-link {
  color: #ffffff;
}

.profile-dropdown .v-icon {
  color: #04448d !important;
}

.profile-dropdown .profile-link {
  color: #04448d !important;
}

/* Hover animation for icon and nav links when scrolled */
.scrolled-nav .navigation li a:hover,
.scrolled-nav .v-icon:hover {
  color: #02adef !important;
  transition: color 0.3s ease;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.profile-card-wrapper {
  max-width: 250px;
}

.profile-card {
  /*transition: all 0.3s ease-in-out;*/
  background-color: #dee8ef !important;
}
.profile-name,
.profile-email {
  font-family: 'Inter', sans-serif;
}
.profile-name {
  padding-bottom: 0%;
  font-size: 20px !important;
  color: #0a8fe7;
}
.profile-email {
  font-size: 12px !important;
}
.link-item {
  opacity: 0;
  animation: fadeInLeft 0.5s forwards;
}
.link-item {
  font-family: 'Inter', Courier, monospace;
  font-size: 15px;
  font-weight: 500;
}
.sidebar-link {
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  text-decoration: none;
  color: #000;
  transition: all 0.2s ease;
}
.sidebar-link:hover {
  background-color: rgba(10, 143, 231, 0.1);
  color: #0a8fe7;
}
.sidebar-link .v-icon {
  color: #04448d;
}
.active-sidebar-link {
  background-color: rgba(10, 143, 231, 0.1);
  color: #0a8fe7;
  font-weight: 500;
}

.avatar-animate {
  opacity: 0;
  transform: scale(0.8);
  animation: fadeInScale 0.5s forwards 0.1s;
}

.initials-animate {
  opacity: 0;
  animation: fadeIn 0.5s forwards 0.2s;
}
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInLeft {
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
