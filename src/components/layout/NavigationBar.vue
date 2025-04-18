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
            <ul>
              <li><router-link class="link" to="/profile">My Account</router-link></li>
              <li><router-link class="link" to="/settings">Settings</router-link></li>
              <li><router-link class="link" :to="{ name: 'login' }">Logout</router-link></li>
            </ul>
          </div>
        </li>
      </ul>

      <!-- Mobile Nav Icon -->
      <v-icon
        class="icon-style"
        @click="toggleMobileNav"
        v-show="mobile"
        :class="{ 'icon-active': mobileNav }"
        >mdi-menu</v-icon
      >

      <!-- Mobile Dropdown -->
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
            <router-link class="link" :to="{ name: '' }"
              ><v-icon>mdi-water</v-icon>Station</router-link
            >
          </li>
          <li>
            <router-link class="link" :to="{ name: '' }"
              ><v-icon>mdi-cart</v-icon>My Order</router-link
            >
          </li>
          <li>
            <router-link class="link" :to="{ name: '' }"
              ><v-icon>mdi-bell</v-icon> Notification</router-link
            >
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

<script>
export default {
  name: 'NavigationBar',
  data() {
    return {
      scrollPosition: null,
      mobile: null,
      mobileNav: null,
      windowWidth: window.innerWidth,
      showNotifications: false,
      showProfileDropdown: false, // 👈 added this
    }
  },

  created() {
    window.addEventListener('resize', this.checkScreen)
    this.checkScreen()
  },

  methods: {
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav
    },

    checkScreen() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 750) {
        this.mobile = true
        return
      }
      this.mobile = false
      this.mobileNav = false
      return
    },

    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      this.showProfileDropdown = false
    },

    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown
      this.showNotifications = false
    },
  },
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
  width: 180px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 8px 0;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
</style>
