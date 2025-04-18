<template>
  <NavigationBar>
    <template #content>
      <v-container fluid class="bg-image">
        <div class="notifications-container">
          <div class="notification-header">
            <h2 class="notification-title">All Notifications</h2>
            <div class="notification-actions">
              <label>
                <input type="checkbox" v-model="selectAll" @change="toggleAllNotifications" />
                Mark All as Read
              </label>
              <label>
                <input type="checkbox" v-model="deleteAll" @change="showDeleteAllModal = true" />
                Delete All
              </label>
            </div>
          </div>

          <div
            v-for="(notification, index) in notifications.slice(0, visibleNotifications)"
            :key="index"
            class="notification-item"
            :class="{ read: notification.read }"
          >
            <input
              type="checkbox"
              v-model="selectedNotifications"
              :value="index"
              class="checkbox-left"
            />
            <img :src="notification.icon" alt="icon" class="notification-icon" />
            <div class="notification-content">
              <strong>{{ notification.title }}!</strong>
              <p>{{ notification.message }}</p>
            </div>
          </div>

          <div class="button-group" v-if="selectedNotifications.length > 0 || showLoadMore">
            <button
              v-if="selectedNotifications.length > 0"
              class="btn-border"
              @click="showDeleteSelectedModal = true"
            >
              Delete Selected
            </button>

            <button v-if="showLoadMore" class="btn-primary" @click="loadMoreNotifications">
              Load More Notifications
            </button>
          </div>
        </div>

        <!-- Delete All Modal -->
        <div class="modal" v-if="showDeleteAllModal">
          <div class="modal-content">
            <p>Are you sure you want to delete all notifications?</p>
            <div class="modal-buttons">
              <button @click="confirmDeleteAll" class="btn-primary">Yes</button>
              <button @click="cancelDeleteAll" class="btn-border">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Delete Selected Modal -->
        <div class="modal" v-if="showDeleteSelectedModal">
          <div class="modal-content">
            <p>Are you sure you want to delete the selected notifications?</p>
            <div class="modal-buttons">
              <button @click="confirmDeleteSelected" class="btn-primary">Yes</button>
              <button @click="cancelDeleteSelected" class="btn-border">Cancel</button>
            </div>
          </div>
        </div>
      </v-container>
    </template>
  </NavigationBar>
</template>

<script>
import NavigationBar from '@/components/layout/NavigationBar.vue'
import galloonIcon from '@/assets/img/icons/galloon.png'
import voucherIcon from '@/assets/img/icons/voucher.png'
import waterIcon from '@/assets/img/icons/water.png'
import noteIcon from '@/assets/img/icons/note.png'
import bellIcon from '@/assets/img/icons/bell.png'
import announceIcon from '@/assets/img/icons/announce.png'

export default {
  name: 'Notification',
  components: {
    NavigationBar,
  },
  data() {
    return {
      notifications: [
        {
          title: 'Order Confirmed',
          message: 'Your order #12345 is confirmed. Expect delivery on March 31, 2025.',
          icon: galloonIcon,
          read: false,
        },
        {
          title: 'Your Order is on the Way',
          message: 'Great news! Your water delivery is out for delivery. Stay hydrated!',
          icon: galloonIcon,
          read: false,
        },
        {
          title: 'Claim Your Discount Voucher',
          message: 'Hi Regine, you have a 10% OFF voucher valid until March 30, 2025.',
          icon: voucherIcon,
          read: false,
        },
        {
          title: 'New Water Station Near You',
          message: 'We’ve partnered with a new clean & safe water refill station in your area!',
          icon: waterIcon,
          read: false,
        },
        {
          title: 'Profile Updated',
          message: 'Your profile information was successfully saved.',
          icon: noteIcon,
          read: false,
        },
        {
          title: 'System Update',
          message: 'A new system update is available.',
          icon: bellIcon,
          read: false,
        },
        {
          title: 'Event Reminder',
          message: 'Reminder: Event at 3 PM today.',
          icon: announceIcon,
          read: false,
        },
        {
          title: 'Maintenance Scheduled',
          message: 'Scheduled maintenance will occur tomorrow at midnight.',
          icon: announceIcon,
          read: false,
        },
      ],
      visibleNotifications: 5,
      showLoadMore: true,
      selectAll: false,
      deleteAll: false,
      selectedNotifications: [],
      showDeleteAllModal: false,
      showDeleteSelectedModal: false,
    }
  },
  methods: {
    loadMoreNotifications() {
      const remaining = this.notifications.length - this.visibleNotifications
      if (remaining > 0) {
        this.visibleNotifications += 5
      }
      if (this.visibleNotifications >= this.notifications.length) {
        this.showLoadMore = false
      }
    },
    toggleAllNotifications() {
      this.notifications.forEach((notification) => {
        notification.read = this.selectAll
      })
    },
    confirmDeleteAll() {
      this.notifications = []
      this.showDeleteAllModal = false
      this.deleteAll = false
    },
    cancelDeleteAll() {
      this.showDeleteAllModal = false
      this.deleteAll = false
    },
    confirmDeleteSelected() {
      this.notifications = this.notifications.filter(
        (_, index) => !this.selectedNotifications.includes(index),
      )
      this.selectedNotifications = []
      this.showDeleteSelectedModal = false
    },
    cancelDeleteSelected() {
      this.showDeleteSelectedModal = false
    },
  },
}
</script>

<style scoped>
.bg-image {
  background-image: url('@/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding-top: 100px;
}

.notifications-container {
  padding: 20px;
  background-color: #ffffffb3;
  border-radius: 10px;
  max-width: 1300px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-actions label {
  margin-left: 15px;
}

.notification-title {
  font-size: 24px;
  font-weight: bold;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  position: relative;
}

.notification-item.read {
  opacity: 0.6;
}

.checkbox-left {
  margin-right: 10px;
  margin-top: 5px;
}

.notification-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.notification-content {
  flex: 1;
}

.notification-content p {
  margin: 5px 0 0;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn-primary {
  background-color: #02adef;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0281b5;
}

.btn-border {
  background-color: transparent;
  border: 2px solid black;
  color: black;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-border:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  max-width: 400px;
  text-align: center;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.btn-primary,
.btn-border {
  padding: 6px 14px;
  font-size: 14px;
}
</style>
