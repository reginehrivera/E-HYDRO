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
          <div v-if="showNotifications" class="notification-dropdown">
            <div class="notification-header">Recently Received Notifications</div>
            <ul>
              <li><strong>Order Confirmed:</strong> Your order #12345 is confirmed.</li>
              <li><strong>On the Way:</strong> Your delivery is out.</li>
              <li><strong>Discount:</strong> 10% voucher until March 30.</li>
              <li><strong>New Station:</strong> We've added one near you.</li>
              <li><strong>Profile Updated:</strong> Info successfully saved.</li>
            </ul>
            <div class="notification-footer">
              <router-link class="view-all" :to="{ name: 'notification' }">View All</router-link>
            </div>  
          </div>
        </li>
        <li>
          <router-link class="link last" :to="{ name: '' }"
            ><v-icon>mdi-account-circle</v-icon></router-link
          >
        </li>
      </ul>
      <!-- <v-icon
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
            <div class="search-bar" :class="{ expanded: isExpanded }">
              <form @submit.prevent="handleSearch" class="search-form">
                <div class="search-input-wrapper">
                  <input
                    type="search"
                    v-model="searchInput"
                    placeholder="Search nearby station..."
                    class="search-input"
                    :class="{ visible: isExpanded }"
                  />

                  < Suggestions Dropdown
                  <ul v-if="isExpanded && searchInput && filteredSuggestions.length" class="suggestion-list">
                    <li
                      v-for="(suggestion, index) in filteredSuggestions"
                      :key="index"
                      @click="selectSuggestion(suggestion)"
                    >
                      {{ suggestion }}
                    </li>
                  </ul>
                </div>
              </form>
              <span class="search-style-btn" @click="toggleSearch">
                <v-icon>mdi-magnify</v-icon>
              </span>
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
              ><v-icon>mdi-cart</v-icon>Order</router-link
            >
          </li>
          <li>
            <router-link class="link" :to="{ name: 'notification' }"
              ><v-icon>mdi-bell</v-icon> Notification</router-link
            >
          </li>
          <li>
            <router-link class="link" :to="{ name: '' }"
              ><v-icon>mdi-account</v-icon> Profile</router-link
            >
          </li>
        </ul>
      </transition>-->
    </nav>
  </header>
  <slot name="content">
  </slot>
  <!--Bottom Navigation Mobile UI-->
  <v-layout class="overflow-visible custom-layout" v-show="mobile"><!--style="height: 56px;"-->
      <v-bottom-navigation
        v-model="value"
        color="teal"
        grow
        class="custom-nav"
      >
        <v-btn class="nav-btn" :to="{ name: 'home' }">
          <v-icon>mdi-home-outline</v-icon><span>Home</span>
        </v-btn>
        <v-btn class="nav-btn" :to="{ name: 'order' }">
          <v-icon>mdi-format-list-checkbox</v-icon><span>Deliveries</span>
        </v-btn>
        <v-btn class="nav-btn" :to="{ name: 'station' }">
          <v-icon class="cart-icon">mdi-cart-outline</v-icon><span>Order</span>
        </v-btn>
        <v-btn class="nav-btn" >
          <v-icon class="bell-icon">mdi-bell-outline</v-icon><span>Notifications</span>
        </v-btn>
        <v-btn class="nav-btn">
          <v-icon>mdi-account-outline</v-icon><span>Profile</span>
        </v-btn>
      </v-bottom-navigation>
    </v-layout>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrollPosition = ref(null)
const mobile = ref(null)
const mobileNav = ref(null)
const windowWidth = ref(window.innerWidth)
const showNotifications = ref(false)

/*const toggleMobileNav = () => {
  mobileNav.value = !mobileNav.value
}*/

const checkScreen = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value <= 750) {
    mobile.value = true
  } else {
    mobile.value = false
    mobileNav.value = false
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

onMounted(() => {
  window.addEventListener('resize', checkScreen)
  checkScreen()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})

//search bar area
/*import { computed } from 'vue'
import { useRouter } from 'vue-router'

const isExpanded = ref(false)
const searchInput = ref('')
const router = useRouter()

const toggleSearch = () => {
  isExpanded.value = !isExpanded.value
}

const stations = {
  aquasis: '/aquasis',
  aquabon: '/aquabon',
  'cold point': '/coldpoint',
  'water drops': '/waterdrops',
}

const filteredSuggestions = computed(() => {
  const input = searchInput.value.toLowerCase()
  return Object.keys(stations).filter((station) =>
    station.toLowerCase().includes(input)
  )
})

const handleSearch = () => {
  const input = searchInput.value.trim().toLowerCase()
  if (stations[input]) {
    router.push(stations[input])
    searchInput.value = ''
  } else {
    alert('Station not found. Try Aquasis, Aquabon, Cold Point, or Water Drops.')
  }
}

const selectSuggestion = (station) => {
  const lowerStation = station.toLowerCase()
  if (stations[lowerStation]) {
    router.push(stations[lowerStation])
    searchInput.value = '' // clear after selecting
  } else {
    alert('Station not found.')
  }
}
//for mobile view: bottom navigation
const value = ref(1)
*/
</script>

<style scoped>
header {
  z-index: 99;
  width: 100%;
  position: fixed;
  transition: 0.5s ease all;
  color: #04448d;
}
@media (max-width: 750px){
  header{
    z-index: none;
    width: none;
    position: none;
    transition: none;
  }
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
    font-size: 25px;
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
  font-size: 50px;
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
  max-width: 330px;
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
  padding: 0;
  margin: 0;
}

.notification-dropdown ul li {
  font-size: 14px;
  margin-bottom: 10px;
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
}

/**---------For Bottom Navigation when UI is mobile----------*/

::v-deep(.custom-nav) {
  background-color: #a9d4e48a !important;
  padding: .3rem !important;
  border-radius: 22px 22px 0 0;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.137);
  background: linear-gradient(120deg, #0557b6, #051f3d, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  text-transform: none;
  transition: background-position 0.5s ease;
}

::v-deep(.custom-nav .v-btn) {
  min-width: 56px;
  padding: 5px 8px;
  color: #ffffffd7 !important; /* Default color */
  font-size: 10px !important;
  border-radius: 50px !important;
  font-family: 'familjen grotesk', Courier, monospace !important;
  font-weight: 400 !important;
}

::v-deep(.custom-nav .v-btn.v-btn--active) {
  color: #02adef !important;
  font-size: 12px !important;
}

::v-deep(.custom-nav .v-btn.v-btn--active .v-icon) {
  color: #02adef !important;
  font-size: 27px;
}

::v-deep(.custom-nav .v-icon) {
  margin-bottom: 2px;
  font-size: 24px;
}
@media(max-width: 450px){
  .first-word,
  .second-word {
    font-weight: 500;
    font-size: 37px !important;
    transition: 0.5s ease all;
    font-family: 'Antonio', sans-serif;
  }
}
</style>
