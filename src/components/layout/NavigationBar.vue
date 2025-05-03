//navigation bar component with in-progress order notification

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
          <div v-if="hasInProgressOrders" class="notification-badge">!</div>
          <div v-if="showNotifications" class="notification-dropdown">
            <div class="notification-header">Recently Received Notifications</div>
            <ul>
              <!-- In Progress Order Notification -->
              <li v-if="hasInProgressOrders" class="new-notification">
                <img
                  src="@/assets/img/icons/galloon.png"
                  alt="In Progress Icon"
                  class="notif-icon"
                />
                <div>
                  <strong>Order In Progress:</strong> Your water delivery is being processed.
                  <span class="timestamp">Just now</span>
                </div>
              </li>
              <li>
                <img src="@/assets/img/icons/confirm.jpg" alt="Confirmed Icon" class="notif-icon" />
                <div><strong>Order Confirmed:</strong> Your order #12345 is confirmed.</div>
              </li>
              <li>
                <img
                  src="@/assets/img/icons/galloon.png"
                  alt="On the Way Icon"
                  class="notif-icon"
                />
                <div><strong>On the Way:</strong> Your delivery is out.</div>
              </li>
              <li>
                <img src="@/assets/img/icons/voucher.png" alt="Discount Icon" class="notif-icon" />
                <div><strong>Discount:</strong> 10% voucher until March 30.</div>
              </li>
              <li>
                <img src="@/assets/img/icons/water.png" alt="New Station Icon" class="notif-icon" />
                <div><strong>New Station:</strong> We've added one near you.</div>
              </li>
              <li>
                <img src="@/assets/img/icons/note.png" alt="Profile Icon" class="notif-icon" />
                <div><strong>Profile Updated:</strong> Info successfully saved.</div>
              </li>
            </ul>
            <div class="notification-footer">
              <router-link class="view-all" to="/notifications">View All</router-link>
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
              <span v-if="hasInProgressOrders" class="mobile-notification-badge">!</span>
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
</template>

<script setup>
// Fix for the navigation bar component
import { onMounted, onUnmounted, ref, computed } from 'vue'
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

// Check if there are in-progress orders
const hasInProgressOrders = computed(() => {
  // Return true if there are any orders with status "To Deliver" or "Processing"
  return orderStore.inProgressOrdersCount > 0
})

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
  } else {
    console.error('Auth error:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
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
}

function toggleProfileDropdown() {
  showProfileDropdown.value = !showProfileDropdown.value
  showNotifications.value = false
}

const handleLogout = () => {
  // Clear user data from Pinia and localStorage
  userStore.clearUserData()
  // Redirect to login page
  router.push('/login')
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

/* ✅ Notification Dropdown Styles */
.notification-wrapper {
  position: relative;
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

.notification-dropdown h4 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #04448d;
}

.notification-dropdown ul {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}

.notification-dropdown ul li {
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  text-align: left;
  padding: 12px 16px;
  margin: 0;
}

.notification-header {
  font-size: 14px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
  color: rgba(4, 68, 141, 0.5);
}

.notification-footer {
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 10px;
  text-align: center;
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
  width: 30px;
  height: 32px;
  object-fit: contain;
  margin-top: 2px;
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

.link .v-icon {
  margin-right: 5px;
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
  top: -8px;
  right: -8px;
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

.new-notification {
  background-color: rgba(253, 123, 56, 0.1);
  border-left: 3px solid #fd7b38;
}

.timestamp {
  display: block;
  font-size: 11px;
  color: #666;
  margin-top: 2px;
}

.notification-wrapper {
  position: relative;
}
</style>
