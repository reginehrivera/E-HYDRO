<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router' //import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/supabase'
import LoadingPage from '@/components/layout/LoadingPage.vue'

// User data
const userStore = useUserStore()
//const route = useRoute()
const router = useRouter()

// Loading state
const isLoading = ref(false)
const fullName = ref('') // Add ref for full_name from profiles table

// Responsive sidebar control
const isMobileMenuOpen = ref(false)
const windowWidth = ref(window.innerWidth)

// Computed property to determine if we're on mobile view
const isMobile = computed(() => windowWidth.value < 768)

// Update window width on resize
const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (!isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu when clicking outside
const closeMobileMenu = () => {
  if (isMobile.value && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

// Profile links
const profileLinks = [
  { route: 'home', text: 'Home' },
  { route: 'station', text: 'Station' },
  { route: 'order', text: 'My Orders' },
  { route: 'notification', text: 'Notifications' },
  {
    text: 'My Account',
    icon: 'mdi-account', // Added explicit icon
    children: [
      { route: 'profile', text: 'View Profile' },
      { route: 'addresses', text: 'My Address' },
    ],
  },
]

const openDropdown = ref(null)

const toggleDropdown = (index) => {
  openDropdown.value = openDropdown.value === index ? null : index
}

// Handle loading completion
const onLoadingComplete = () => {
  // This will be triggered when the loading animation completes
}

// Fetch user profile data
const fetchUserProfile = async () => {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Fetch profile data from the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (profile) {
        // Set the full_name for initials
        fullName.value = profile.full_name || ''
      }
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
}

const handleLogout = async () => {
  try {
    console.log('Logout function triggered')

    // Show the loading animation
    isLoading.value = true

    // Create a promise that will resolve after 3 seconds
    const loadingPromise = new Promise((resolve) => setTimeout(resolve, 3000))

    // Clear user data from store
    userStore.clearUserData()

    // Sign out using Supabase
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error during logout:', error)
      isLoading.value = false
      return
    }

    console.log('Logged out successfully, waiting for loading animation')

    // Wait for the loading animation to complete (3 seconds)
    await loadingPromise

    // Redirect to login page
    router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
    isLoading.value = false
  }
}

// Updated computed property to use the fetched full_name
const initials = computed(() => {
  if (!fullName.value) return ''
  const names = fullName.value.trim().split(' ')
  return names
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

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

// Lifecycle hooks
onMounted(async () => {
  // Set up window resize event listener
  window.addEventListener('resize', handleResize)

  // Fetch user profile data
  await fetchUserProfile()
})

onMounted(() => {
  return () => {
    // Clean up event listener when component is destroyed
    window.removeEventListener('resize', handleResize)
  }
})

// Expose methods and properties that parent might need
defineExpose({
  isMobile,
  isMobileMenuOpen,
  toggleMobileMenu,
  closeMobileMenu,
})
</script>

<template>
  <!-- Custom Loading Animation -->
  <loading-page v-if="isLoading" :show="isLoading" @loading-complete="onLoadingComplete" />

  <!-- Hamburger menu for mobile view -->
  <div
    class="hamburger-container"
    v-if="isMobile"
    style="position: fixed; top: 10px; right: 10px; z-index: 100"
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
  <div v-if="isMobile && isMobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>

  <!-- Sidebar Section -->
  <v-row
    class="profile-card-wrapper"
    :class="{ 'mobile-menu-open': isMobileMenuOpen }"
    :style="{
      position: 'fixed',
      top: isMobile ? '0' : '0',
      left: 0,
      height: '100vh',
      margin: 0,
      zIndex: 10,
      width: '270px',
      transform: isMobile && !isMobileMenuOpen ? 'translateX(-100%)' : 'translateX(0)',
      transition: 'transform 0.3s ease-in-out',
    }"
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
              color="#dbdbdb"
              size="115"
              class="avatar-animate mb-1"
              :style="{
                border: '3px solid #0a8fe7',
              }"
            >
              <img
                v-if="userStore.avatar_url"
                :src="userStore.avatar_url"
                alt="Avatar"
                class="avatar-img"
              />
              <p v-else class="text-h5 initials-animate">{{ initials || '??' }}</p>
            </v-avatar>

            <div class="d-flex flex-column align-center profile-info text-center">
              <span class="profile-name text-h6 font-weight-bold">
                {{ fullName }}
              </span>
              <span class="profile-email text-caption mb-3">
                <v-icon small class="mr-1">mdi-email</v-icon>
                {{ userStore.email }}
              </span>
            </div>
          </div>
        </v-card-item>

        <v-card-text class="pt-0 pb-4">
          <v-divider class="mb-3"></v-divider>
          <!-- Loop through each navigation item -->
          <div
            v-for="(link, index) in profileLinks"
            :key="index"
            class="link-item"
            :style="{ animationDelay: `${0.2 + index * 0.1}s` }"
          >
            <!-- Dropdown item (My Account) -->
            <template v-if="link.children">
              <div class="link d-flex align-center" @click="toggleDropdown(index)">
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
                  class="link d-flex align-center"
                  :class="{ 'active-link': $route.name === sublink.route }"
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
                class="link d-flex align-center"
                :class="{ 'active-link': $route.name === link.route }"
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
            <div class="link d-flex align-center" @click="handleLogout" style="cursor: pointer">
              <v-icon small class="mr-2">mdi-logout</v-icon>
              <span>Logout</span>
              <v-spacer />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
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
.link {
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  text-decoration: none;
  color: #000;
  transition: all 0.2s ease;
}
.link:hover {
  background-color: rgba(10, 143, 231, 0.1);
  color: #0a8fe7;
}

.router-link-exact-active {
  color: #02adef;
  border-bottom: 1px solid #02adef;
}

.link .v-icon {
  color: #04448d;
}
.active-link {
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
