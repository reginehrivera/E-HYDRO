<template>
  <header :class="{ 'scrolled-nav': scrollPosition }">
    <nav>
      <div class="branding">
        <span class="first-word">E</span>
        <span class="second-word">-HYDRO</span>
      </div>

      <!-- Dynamic Search Bar in Navbar (shows when scrolled on station page) -->
      <div
        v-if="showSearchInNavbar"
        class="navbar-search-container"
        :class="{ 'search-visible': showSearchInNavbar }"
      >
        <v-form class="navbar-search-form" role="search" @submit.prevent="handleNavbarSearch">
          <div class="animated-border-wrapper">
            <v-text-field
              v-model="navbarSearchInput"
              variant="outlined"
              placeholder="Search stations..."
              density="compact"
              hide-details
              class="navbar-search-input"
              prepend-inner-icon="mdi-magnify"
              aria-label="Search"
              @input="onNavbarSearchInput"
            ></v-text-field>
          </div>

          <!-- Navbar Suggestions Dropdown -->
          <ul
            v-if="navbarSearchInput && navbarFilteredSuggestions.length"
            class="navbar-suggestion-list"
          >
            <li
              v-for="(suggestion, index) in navbarFilteredSuggestions"
              :key="index"
              @click="selectNavbarSuggestion(suggestion)"
            >
              {{ suggestion }}
            </li>
          </ul>
        </v-form>
      </div>

      <ul v-show="!mobile" class="navigation">
        <li>
          <router-link
            class="nav-link"
            :class="{ 'nav-link-icon-mode': scrollPosition }"
            :to="{ name: 'home' }"
          >
            <!-- Show text when NOT scrolled -->
            <span v-if="!scrollPosition" class="nav-text">Home</span>

            <!-- Show icon when scrolled -->
            <div v-if="scrollPosition" class="nav-icon-container" data-tooltip="Home">
              <v-icon class="nav-icon">mdi-home</v-icon>
            </div>
          </router-link>
        </li>

        <li>
          <router-link
            class="nav-link"
            :class="{ 'nav-link-icon-mode': scrollPosition }"
            :to="{ name: 'station' }"
          >
            <!-- Show text when NOT scrolled -->
            <span v-if="!scrollPosition" class="nav-text">Station</span>

            <!-- Show icon when scrolled -->
            <div v-if="scrollPosition" class="nav-icon-container" data-tooltip="Station">
              <v-icon class="nav-icon">mdi-storefront</v-icon>
            </div>
          </router-link>
        </li>

        <li>
          <router-link
            class="nav-link"
            :class="{ 'nav-link-icon-mode': scrollPosition }"
            :to="{ name: 'order' }"
          >
            <!-- Show text when NOT scrolled -->
            <span v-if="!scrollPosition" class="nav-text">My Order</span>

            <!-- Show icon when scrolled -->
            <div v-if="scrollPosition" class="nav-icon-container" data-tooltip="My Order">
              <v-icon class="nav-icon">mdi-package-variant</v-icon>
            </div>
          </router-link>
        </li>

        <!-- Notification and Profile stay the same - always icons -->
        <li class="notification-wrapper" ref="notificationRef">
          <v-icon class="second-last" @click="toggleNotifications">mdi-bell</v-icon>
          <!-- Show notification badge if there are notifications -->
          <div v-if="hasNotifications" class="notification-badge">{{ notificationCount }}</div>
          <div v-if="showNotifications" class="notification-dropdown">
            <!-- Your existing notification dropdown content -->
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

        <li class="profile-wrapper" ref="profileRef">
          <v-avatar
            size="45"
            color="#dbdbdb"
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
            <!-- Your existing profile dropdown content -->
            <div class="profile-info">
              <v-avatar size="70" color="#dbdbdb" class="profile-initials">
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
          width: '270px',
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
import { onMounted, onUnmounted, ref, computed, provide, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useOrderStore } from '@/stores/orders'
import { supabase } from '@/supabase'
import { useRouter, useRoute } from 'vue-router'
import LoadingPage from '@/components/layout/LoadingPage.vue'

const userStore = useUserStore()
const orderStore = useOrderStore()
const router = useRouter()
const route = useRoute()

// --- Refs ---
const mobile = ref(null)
const windowWidth = ref(window.innerWidth)
const showNotifications = ref(false)
const showProfileDropdown = ref(false)
const isLoggingOut = ref(false)
const viewedNotificationIds = ref(new Set())

// New mobile menu refs from sidebar component
const isMobileMenuOpen = ref(false)
const openDropdown = ref(null)

// Search bar refs
const showSearchInNavbar = ref(false)
const navbarSearchInput = ref('')
const navbarFilteredSuggestions = ref([])

// Search suggestions for both local and navbar search
const searchSuggestions = [
  'Aquasis Water Station',
  'Aquabon Water Station',
  'Cold Point Water Station',
  'Water Drops Water Station',
]

const stations = {
  // Exact matches
  aquasis: { name: 'aquasis' },
  'aquasis water station': { name: 'aquasis' },
  aquabon: { name: 'aquabon' },
  'aquabon water station': { name: 'aquabon' },
  'cold point': { name: 'coldpoint' },
  'cold point water station': { name: 'coldpoint' },
  'water drops': { name: 'waterdrops' },
  'water drops water station': { name: 'waterdrops' },

  // Partial matches
  aqua: { name: 'station' }, // Go to general station page for ambiguous searches
  water: { name: 'station' },
  station: { name: 'station' },
}

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
const hasNotifications = computed(() => notificationCount.value > 0)

// Modified computed property for notification count
const notificationCount = computed(() => {
  return orderNotifications.value.filter((n) => n.isNew && !viewedNotificationIds.value.has(n.id))
    .length
})

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
  { route: 'notification', text: 'Notifications' },
  {
    text: 'My Account',
    icon: 'mdi-account',
    children: [
      { route: 'profile', text: 'View Profile' },
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
  showProfileDropdown.value = false // Close profile dropdown when opening notifications

  // Mark notifications as viewed when opened
  if (showNotifications.value) {
    // Add all current notification IDs to viewed set
    orderNotifications.value.forEach((notif) => {
      if (notif.isNew) {
        viewedNotificationIds.value.add(notif.id)
      }
    })

    // Also mark them as not new in the array (optional, for consistency)
    orderNotifications.value = orderNotifications.value.map((notif) => ({
      ...notif,
      isNew: false,
    }))

    // Store viewed IDs in sessionStorage to persist across page navigation
    try {
      sessionStorage.setItem(
        'viewedNotificationIds',
        JSON.stringify([...viewedNotificationIds.value]),
      )
    } catch (e) {
      console.log('SessionStorage not available, using memory only')
    }
  }
}

function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value
  showNotifications.value = false // Close notifications when opening profile dropdown
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
    notification: 'mdi-bell',
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

    // Initialize viewed notifications from storage
    initializeViewedNotifications()

    // Rest of your existing code remains the same...
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
        // Check if this notification was already viewed
        isNew:
          !viewedNotificationIds.value.has(order.id) &&
          (order.status === 'To Deliver' || order.status === 'Processing'),
        id: order.id,
      }
    })

    // Set up real-time listener for this user
    setupOrderStatusListener(userId)
  } catch (err) {
    console.error('Failed to fetch initial notifications:', err)
  }
}

// Optional: Add a function to clear viewed notifications on logout
function clearViewedNotifications() {
  viewedNotificationIds.value.clear()
  try {
    sessionStorage.removeItem('viewedNotificationIds')
  } catch (e) {
    console.log('Could not clear viewed notifications from storage')
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

// Update your updateScroll function in the navbar component
function updateScroll() {
  // If scrolled more than 50px, set scrollPosition to true
  scrollPosition.value = window.scrollY > 50

  // Pages that have search bars (add your actual route names here)
  const pagesWithSearchBar = ['station', 'aquabon', 'aquasis', 'coldpoint', 'waterdrops'] // Add all route names that have search bars

  // Show/hide search bar in navbar based on scroll position and current route
  if (pagesWithSearchBar.includes(route.name)) {
    showSearchInNavbar.value = window.scrollY > 50
    console.log('On page with search bar, should show:', showSearchInNavbar.value)
  } else {
    showSearchInNavbar.value = false
    console.log('Not on page with search bar, hiding search')
  }
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
  allNotifications.value.unshift(notification)

  console.log('Current notifications:', orderNotifications.value.length)

  // Show toast notification
  let toastType = 'info'
  if (type === 'completed') toastType = 'success'
  if (type === 'cancelled') toastType = 'error'
  if (type === 'progress') toastType = 'info'

  showStatusToast(`${title}: ${message}`, toastType)
}

function initializeViewedNotifications() {
  try {
    const stored = sessionStorage.getItem('viewedNotificationIds')
    if (stored) {
      const ids = JSON.parse(stored)
      viewedNotificationIds.value = new Set(ids)
    }
  } catch (e) {
    console.log('Could not load viewed notifications from storage')
    viewedNotificationIds.value = new Set()
  }
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

    // Clear viewed notifications
    clearViewedNotifications()

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
    window.location.href = '/login'
  } catch (err) {
    console.error('Logout completion failed:', err)
    isLoggingOut.value = false
  }
}
// Watch for route changes to hide search bar when not on station page
watch(
  () => route.name,
  (newRouteName) => {
    const pagesWithSearchBar = ['station', 'aquabon', 'aquasis', 'coldpoint', 'waterdrops'] // Same array

    if (!pagesWithSearchBar.includes(newRouteName)) {
      showSearchInNavbar.value = false
      navbarSearchInput.value = ''
      navbarFilteredSuggestions.value = []
    }
  },
)

// Provide notifications to other components
provide('allNotifications', allNotifications)
provide('orderNotifications', orderNotifications)

// Lifecycle hooks
onMounted(async () => {
  window.addEventListener('resize', checkScreen)
  window.addEventListener('scroll', updateScroll)

  // Add click outside listener for dropdowns
  document.addEventListener('click', handleClickOutsideRefs)

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

  // Remove click outside listener
  document.removeEventListener('click', handleClickOutsideRefs)

  // Clean up Supabase subscription
  if (orderSubscription) {
    orderSubscription.unsubscribe()
  }

  // Clear any toast timeout
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
  }
})

// Alternative method using refs (more reliable)
const notificationRef = ref(null)
const profileRef = ref(null)

// Function to handle click outside using refs
function handleClickOutsideRefs(event) {
  // Close notifications if clicking outside
  if (
    showNotifications.value &&
    notificationRef.value &&
    !notificationRef.value.contains(event.target)
  ) {
    showNotifications.value = false
  }

  // Close profile dropdown if clicking outside
  if (showProfileDropdown.value && profileRef.value && !profileRef.value.contains(event.target)) {
    showProfileDropdown.value = false
  }
}

// Add this to your NavigationBar component's script section

// Import inject to get data from station page
import { inject } from 'vue'

// In your setup function, add this:
const stationSearchData = inject('stationSearchData', null)

// Update your navbar search methods to use station page data when available:
function onNavbarSearchInput() {
  if (stationSearchData && route.name === 'station') {
    // Use the station page's search input
    stationSearchData.searchInput.value = navbarSearchInput.value
    if (stationSearchData.onSearchInput) {
      stationSearchData.onSearchInput()
    }

    // Update suggestions based on station page data
    if (navbarSearchInput.value) {
      navbarFilteredSuggestions.value = stationSearchData.searchSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(navbarSearchInput.value.toLowerCase()),
      )
    } else {
      navbarFilteredSuggestions.value = []
    }
  } else {
    // Use default behavior for other pages
    if (navbarSearchInput.value) {
      navbarFilteredSuggestions.value = searchSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(navbarSearchInput.value.toLowerCase()),
      )
    } else {
      navbarFilteredSuggestions.value = []
    }
  }
}

function handleNavbarSearch() {
  if (stationSearchData && route.name === 'station') {
    // Use station page's search handler
    stationSearchData.searchInput.value = navbarSearchInput.value
    stationSearchData.handleSearch()
    navbarSearchInput.value = ''
    navbarFilteredSuggestions.value = []
  } else {
    // Handle search for other pages
    const searchTerm = navbarSearchInput.value.trim().toLowerCase()

    if (searchTerm) {
      // Check if search term matches any station
      if (searchTerm.includes('aquabon')) {
        router.push({ name: 'aquabon' })
      } else if (searchTerm.includes('aquasis')) {
        router.push({ name: 'aquasis' })
      } else if (searchTerm.includes('cold point')) {
        router.push({ name: 'coldpoint' })
      } else if (searchTerm.includes('water drops')) {
        router.push({ name: 'waterdrops' })
      } else {
        // Try stations object
        const stationRoute = stations[searchTerm]
        if (stationRoute) {
          router.push(stationRoute)
        } else {
          // Default to station page with search query
          router.push({
            name: 'station',
            query: { search: navbarSearchInput.value },
          })
        }
      }

      navbarSearchInput.value = ''
      navbarFilteredSuggestions.value = []
    }
  }
}

function selectNavbarSuggestion(suggestion) {
  navbarSearchInput.value = suggestion
  navbarFilteredSuggestions.value = []

  if (stationSearchData && route.name === 'station') {
    // Use station page's suggestion handler
    stationSearchData.selectSuggestion(suggestion)
    navbarSearchInput.value = ''
  } else {
    // Add navigation logic for other pages
    const searchKey = suggestion.toLowerCase()

    // Check if it matches any station
    if (searchKey.includes('aquabon')) {
      router.push({ name: 'aquabon' })
    } else if (searchKey.includes('aquasis')) {
      router.push({ name: 'aquasis' })
    } else if (searchKey.includes('cold point')) {
      router.push({ name: 'coldpoint' })
    } else if (searchKey.includes('water drops')) {
      router.push({ name: 'waterdrops' })
    } else {
      // Fallback - try to find exact match in stations object
      const stationRoute = stations[searchKey]
      if (stationRoute) {
        router.push(stationRoute)
      } else {
        // If no specific station found, go to general station page
        router.push({ name: 'station' })
      }
    }

    // Clear search input after navigation
    navbarSearchInput.value = ''
  }
}

// Watch for changes in station page search input to sync with navbar
watch(
  () => stationSearchData?.searchInput?.value,
  (newValue) => {
    if (route.name === 'station' && newValue !== navbarSearchInput.value) {
      navbarSearchInput.value = newValue || ''
    }
  },
)
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

.navbar-suggestion-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-suggestion-list li {
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.navbar-suggestion-list li:hover {
  background-color: #f5f5f5;
}

.navbar-suggestion-list li:last-child {
  border-bottom: none;
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
  transition: all 0.3s ease !important;
  text-decoration: none !important;
  display: flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 6px;
  gap: 12px;
}

/* Profile link hover effect */
.profile-link:hover {
  color: #02adef !important;
  background-color: rgba(2, 173, 239, 0.1) !important;
  transform: translateX(2px);
}

/* Profile link visited state */
.profile-link:visited {
  color: #04448d !important;
}

.profile-link:visited:hover {
  color: #02adef !important;
}

/* Icon colors in profile dropdown */
.profile-dropdown .v-icon {
  color: #04448d !important;
  transition: color 0.3s ease !important;
}

/* Icon hover effect */
.profile-link:hover .v-icon {
  color: #02adef !important;
}

/* Specific icon hover styles */
.profile-link:hover .edit-icon,
.profile-link:hover .address-icon,
.profile-link:hover .logout-icon {
  color: #02adef !important;
}

/* Make sure the list items don't interfere */
.profile-dropdown ul li {
  padding: 0 !important;
  margin: 0 !important;
  border-bottom: 1px solid #e0e0e0;
}

.profile-dropdown ul li:last-child {
  border-bottom: none;
}

li {
  padding: 15px;
  margin-left: 27px;
}

.last,
.second-last {
  margin-left: -2rem !important;
}

.last {
  font-size: 34px;
}

.second-last {
  font-size: 32px;
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

.navbar-search-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
  color: #ffffff;
}

.navbar-search-container.search-visible {
  opacity: 1;
  visibility: visible;
}

/* Navbar Search Form */
.navbar-search-form {
  width: 100%;
}

/* Navbar Search Input */
.navbar-search-input {
  position: relative;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar-search-container {
    width: 300px;
  }
}

@media (max-width: 480px) {
  .navbar-search-container {
    width: 250px;
  }
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
  right: -10px;
  top: 66px;
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
  right: -2px;
  top: 75px;
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
  align-self: center;
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
  right: 9px;
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
  color: #ffffff;
}

.scrolled-nav .notif-icon {
  color: #02b5fc;
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
  max-width: 270px;
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

/* Add these styles to your component */

/* Navigation base styles */
.navigation {
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

/* Nav link base styles */
.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;
  min-height: 40px;
  background: transparent;
  border-bottom: 1px solid transparent;
}

/* Text mode - default state */
.nav-text {
  font-size: 18px;
  font-weight: 400;
  color: #04448d;
  font-family: 'Inter', sans-serif;
  transition: 0.5s ease all;
}

/* Text mode - default state */
.nav-text:hover {
  color: #0a8fe7;
  font-weight: 600;
}

.nav-link.router-link-active .nav-text {
  color: #0a8fe7;
  font-weight: 600;
}

/* Icon mode - scrolled state */
.nav-link-icon-mode {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
}
.nav-link-icon-mode {
  margin-right: 1px; /* or 4px for tighter spacing */
}

.nav-link-icon-mode:last-child {
  margin-right: -60px;
  right: 50px;
}

.nav-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon {
  font-size: 28px !important;
  color: #555;
  transition: all 0.3s ease;
}

/* Tooltip styles */
.nav-icon-container::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: -55px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

/* Tooltip arrow */
.nav-icon-container::before {
  content: '';
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid rgba(0, 0, 0, 0.85);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

/* Show tooltip on hover */
.nav-icon-container:hover::after,
.nav-icon-container:hover::before {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-2px);
}

.nav-link-icon-mode:hover .nav-icon {
  color: #0a8fe7;
  transform: scale(1.15);
}

/* Active link styles */
.nav-link-icon-mode.router-link-active {
  background: rgba(10, 143, 231, 0.15);
  box-shadow: 0 2px 2px rgba(10, 143, 231, 0.2);
}

.nav-link.router-link-active .nav-icon {
  color: #0a8fe7;
  transform: scale(1.1);
}

/* Scrolled navbar adjustments */
.scrolled-nav .navigation {
  gap: 8px;
}

.navigation li:nth-last-child(2) {
  margin-right: 15px; /* Space after notification icon */
}

.navigation li:last-child {
  margin-left: 0;
  margin-top: 8px;
}

.scrolled-nav {
  padding: 8px 0;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

/* Smooth transitions for the entire header */
header {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Notification and profile icons stay unchanged */
.notification-wrapper,
.profile-wrapper {
  position: relative;
}

.notification-wrapper {
  margin-right: 15px; /* Add space between notification and profile */
}

.profile-wrapper {
  margin-left: 0; /* Remove extra left margin */
}

.second-last,
.profile-initials {
  transition: all 0.3s ease;
}

.second-last:hover,
.profile-initials:hover {
  transform: scale(1.1);
  cursor: pointer;
}

/* Animation for state changes */
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

.nav-icon-container {
  animation: fadeInScale 0.3s ease-out;
}

.nav-text {
  animation: fadeInScale 0.3s ease-out;
}

/* Responsive design */
@media (max-width: 1200px) {
  .navigation {
    gap: 15px;
  }

  .nav-link {
    padding: 10px 16px;
  }

  .nav-link-icon-mode {
    padding: 5px;
    min-width: 44px;
    min-height: 44px;
  }
}
</style>
