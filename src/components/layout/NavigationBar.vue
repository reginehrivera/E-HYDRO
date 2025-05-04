//navigation bar component

<template>
  <header :class="{ 'scrolled-nav': scrollPosition }">
    <nav>
      <div class="branding">
        <span class="first-word">E</span>
        <span class="second-word">-HYDRO</span>
      </div>
      <ul v-show="!mobile" class="navigation">
        <li><router-link class="link" :to="{ name: 'home' }">Home</router-link></li>
        <li><router-link class="link" :to="{ name: 'station' }">Station</router-link></li>
        <li><router-link class="link" :to="{ name: 'order' }">My Order</router-link></li>
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
          <v-icon class="last" @click="toggleProfileDropdown">mdi-account-circle</v-icon>
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
                <router-link class="link" to="/MyAccount">
                  <v-icon class="edit-icon small-icon">mdi-account</v-icon>
                  Edit Profile
                </router-link>
              </li>
              <li>
                <router-link class="link" to="/addresses">
                  <v-icon class="address-icon small-icon">mdi-map-marker</v-icon> Delivery Address
                </router-link>
              </li>

              <li>
                <router-link class="link" to="/">
                  <v-icon class="logout-icon small-icon">mdi-logout</v-icon> Logout
                </router-link>
              </li>
            </ul>
          </div>
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
          <li>
            <router-link class="link" :to="{ name: 'home' }"
              ><v-icon>mdi-home</v-icon>Home</router-link
            >
          </li>
          <li>
            <router-link class="link" :to="{ name: 'station' }"
              ><v-icon>mdi-water</v-icon>Station</router-link
            >
          </li>
          <li>
            <router-link class="link" :to="{ name: 'order' }"
              ><v-icon>mdi-cart</v-icon>My Order</router-link
            >
          </li>
          <li>
            <router-link class="link" :to="{ name: 'notification' }"
              ><v-icon>mdi-bell</v-icon> Notification
              <span v-if="hasNotifications" class="mobile-notification-badge">{{
                notificationCount
              }}</span>
            </router-link>
          </li>
          <li>
            <router-link class="link" :to="{ name: '' }"
              ><v-icon>mdi-account</v-icon> Profile</router-link
            >
          </li>
        </ul>
      </transition>
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
</template>

<script setup>
// Fix for the navigation bar component
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/orders' // Import the order store
import { supabase } from '@/supabase' // adjust path if needed

const userStore = useUserStore()
const orderStore = useOrderStore() // Use the order store

// Fix: Use avatar_url (to match your store) instead of avatarUrl
const avatarUrl = computed(() => {
  return userStore.avatar_url || authUser.value?.user_metadata?.avatar_url || ''
})

// --- Refs ---
const scrollPosition = ref(null)
const mobile = ref(null)
const mobileNav = ref(null)
const windowWidth = ref(window.innerWidth)
const showNotifications = ref(false)
const showProfileDropdown = ref(false)

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

// --- Notification System ---
const orderNotifications = ref([])
const notificationCount = computed(() => orderNotifications.value.filter((n) => n.isNew).length)
const hasNotifications = computed(() => notificationCount.value > 0)

// Toast notification system
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('info') // Can be info, success, warning, error
const toastIcon = ref('mdi-information')
const toastTimeout = ref(null)

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
        console.log('Order status change detected:', payload) // Add logging to check payload

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

  // Test the notification system immediately
  console.log('Order status subscription established for user:', userId)
}

// Add a manual method to trigger cancel notification (for testing)
function testCancelNotification(orderId = Math.floor(Math.random() * 10000)) {
  addNotification(
    'cancelled',
    'Order Cancelled',
    `Your order #${orderId} has been cancelled. Please contact customer support for assistance.`,
  )
  console.log('Manual cancel notification triggered for order:', orderId)
}

// Add to onMounted to test functionality
onMounted(async () => {
  // ... existing code ...
  // For testing - uncomment to test cancel notification functionality
  // setTimeout(() => {
  //   testCancelNotification()
  // }, 5000)
})
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

// Check if there are in-progress orders
const hasInProgressOrders = computed(() => {
  // Return true if there are any orders with status "To Deliver" or "Processing"
  return (
    orderStore.inProgressOrdersCount > 0 ||
    orderNotifications.value.some((n) => n.type === 'progress' && n.isNew)
  )
})

// For demo purposes - add some test notifications
function addTestNotification(type) {
  const orderId = Math.floor(Math.random() * 10000)

  if (type === 'progress') {
    addNotification(
      'progress',
      'Order In Progress',
      `Your order #${orderId} is being processed. We'll update you when it's ready for delivery.`,
    )
  } else if (type === 'cancelled') {
    addNotification(
      'cancelled',
      'Order Cancelled',
      `Your order #${orderId} has been cancelled. Please contact customer support for assistance.`,
    )
  } else if (type === 'completed') {
    addNotification(
      'completed',
      'Order Completed',
      `Your order #${orderId} has been successfully delivered. Thank you for using E-HYDRO!`,
    )
  }
}

// Fetch authenticated user and check for in-progress orders on mount
onMounted(async () => {
  window.addEventListener('resize', checkScreen)
  checkScreen()

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

    // For demo purposes, can be removed in production
    // Simulate some notifications coming in
    // setTimeout(() => addTestNotification('progress'), 3000)
    // setTimeout(() => addTestNotification('completed'), 10000)
    // setTimeout(() => addTestNotification('cancelled'), 15000)
  } else {
    console.error('Auth error:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
  // Clean up Supabase subscription
  if (orderSubscription) {
    orderSubscription.unsubscribe()
  }
  // Clear any toast timeout
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
  }
})

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

  // Mark notifications as read when opened
  if (showNotifications.value) {
    // Fixed: There was a single 'a' character here that would cause an error
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

import { provide } from 'vue'

const MAX_NAVBAR_NOTIFICATIONS = 7
const allNotifications = ref([]) // Store all notifications

// Computed property to return only the first 6 notifications for the navbar
const limitedNotifications = computed(() => {
  return orderNotifications.value.slice(0, MAX_NAVBAR_NOTIFICATIONS)
})

// Provide notifications to other components
provide('allNotifications', allNotifications)
provide('orderNotifications', orderNotifications)

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
</script>

<style scoped>
header {
  z-index: 99;
  width: 100%;
  position: fixed;
  transition: 0.5s ease all;
  color: #04448d;
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

  .last,
  second-last {
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
}

.link {
  font-size: 18px;
  transition: 0.5s ease all;
  border-bottom: 1px solid transparent;
  &:hover {
    color: #02adef;
    border-color: #02adef;
  }
}

.branding {
  display: flex;
  align-items: center;

  .first-word,
  .second-word {
    font-weight: 500;
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
}
.navigation {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}
@keyframes bell-shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(3deg);
  }
  50% {
    transform: rotate(-3deg);
  }
  75% {
    transform: rotate(2deg);
  }
}

.bell {
  display: inline-block;
  animation: bell-shake 1s infinite ease-in-out;
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
  li {
    .link {
      color: #04448d;
      font-size: 18px;
    }
  }
}

.notification-dropdown {
  position: absolute;
  right: 0;
  top: 60px;
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
  right: 21px;
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

.profile-dropdown .link:hover {
  color: #02adef;
}

.profile-dropdown {
  position: absolute;
  right: 0;
  top: 60px;
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
  right: 31px;
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
  font-size: 19px;
}

/* Ensure underline only appears on text */
.link {
  font-size: 18px;
  transition: 0.5s ease all;
  border-bottom: 1px solid transparent;
  display: inline-block;
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
  border: 3px solid #7e57c2;
  margin-bottom: 10px;
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
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
</style>
