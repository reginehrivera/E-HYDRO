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
            <button class="btn-details" @click="viewDetails(notification)">View Details</button>
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

          <div v-if="!showLoadMore" class="no-more-notifications">No more notifications.</div>

          <div class="modal" v-if="showDeleteAllModal">
            <div class="modal-content">
              <p>Are you sure you want to delete all notifications?</p>
              <div class="modal-buttons">
                <button @click="confirmDeleteAll" class="btn-primary">Yes</button>
                <button @click="cancelDeleteAll" class="btn-border">Cancel</button>
              </div>
            </div>
          </div>

          <div class="modal" v-if="showDeleteSelectedModal">
            <div class="modal-content">
              <p>Are you sure you want to delete the selected notifications?</p>
              <div class="modal-buttons">
                <button @click="confirmDeleteSelected" class="btn-primary">Yes</button>
                <button @click="cancelDeleteSelected" class="btn-border">Cancel</button>
              </div>
            </div>
          </div>

          <div class="modal" v-if="selectedNotificationDetails">
            <div class="modal-content">
              <h3>{{ selectedNotificationDetails.title }}</h3>
              <p>{{ selectedNotificationDetails.message }}</p>
              <p><strong>Date Received:</strong> {{ selectedNotificationDetails.date }}</p>
              <div class="modal-buttons">
                <button @click="selectedNotificationDetails = null" class="btn-primary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </template>
  </NavigationBar>
</template>

<script setup>
import { ref } from 'vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import galloonIcon from '@/assets/img/icons/galloon.png'
import confirmIcon from '@/assets/img/icons/confirm.jpg'
import voucherIcon from '@/assets/img/icons/voucher.png'
import waterIcon from '@/assets/img/icons/water.png'
import noteIcon from '@/assets/img/icons/note.png'
import bellIcon from '@/assets/img/icons/bell.png'
import announceIcon from '@/assets/img/icons/announce.png'
import warningIcon from '@/assets/img/icons/warning.png'

const notifications = ref([
  {
    title: 'Order Confirmed',
    message: 'Your order #12345 is confirmed. Expect delivery on March 31, 2025.',
    icon: confirmIcon,
    read: false,
    date: 'March 27, 2025',
  },
  {
    title: 'Your Order is on the Way',
    message: 'Great news! Your water delivery is out for delivery. Stay hydrated!',
    icon: galloonIcon,
    read: false,
    date: 'March 28, 2025',
  },
  {
    title: 'Claim Your Discount Voucher',
    message: 'Hi Regine, you have a 10% OFF voucher valid until March 30, 2025.',
    icon: voucherIcon,
    read: false,
    date: 'March 25, 2025',
  },
  {
    title: 'New Water Station Near You',
    message: 'We’ve partnered with a new clean & safe water refill station in your area!',
    icon: waterIcon,
    read: false,
    date: 'March 22, 2025',
  },
  {
    title: 'Profile Updated',
    message: 'Your profile information was successfully saved.',
    icon: noteIcon,
    read: false,
    date: 'March 20, 2025',
  },
  {
    title: 'System Update',
    message: 'A new system update is available.',
    icon: bellIcon,
    read: false,
    date: 'March 19, 2025',
  },
  {
    title: 'Event Reminder',
    message: 'Reminder: Event at 3 PM today.',
    icon: announceIcon,
    read: false,
    date: 'March 18, 2025',
  },
  {
    title: 'Maintenance Scheduled',
    message: 'Scheduled maintenance will occur tomorrow at midnight.',
    icon: announceIcon,
    read: false,
    date: 'March 17, 2025',
  },
  {
    title: 'Delivery Delayed Due to Weather Conditions',
    message:
      'We apologize for the delay. Due to heavy rain, your order may arrive later than expected. Stay safe!',
    icon: warningIcon,
    read: false,
    date: 'March 17, 2025',
  },
  {
    title: 'Friendly Reminder: Check Your Water Supply',
    message: 'Running low on water? Don’t wait—reorder today!',
    icon: bellIcon,
    read: false,
    date: 'March 16, 2025',
  },
  {
    title: 'We Value Your Feedback!',
    message: 'How was your last order? Let us know by rating your experience.',
    icon: noteIcon,
    read: false,
    date: 'March 15, 2025',
  },
  {
    title: 'Reminder: Stay Hydrated!',
    message: 'Drinking enough water is essential! Don’t forget to order.',
    icon: announceIcon,
    read: false,
    date: 'March 15, 2025',
  },
  {
    title: 'Update Your Address for Faster Deliveries!',
    message: 'Update your address now for faster and more accurate deliveries.',
    icon: announceIcon,
    read: false,
    date: 'March 15, 2025',
  },
])

const visibleNotifications = ref(5)
const showLoadMore = ref(true)
const selectAll = ref(false)
const deleteAll = ref(false)
const selectedNotifications = ref([])
const showDeleteAllModal = ref(false)
const showDeleteSelectedModal = ref(false)
const selectedNotificationDetails = ref(null)

function loadMoreNotifications() {
  visibleNotifications.value += 5
  if (visibleNotifications.value >= notifications.value.length) {
    showLoadMore.value = false
  }
}

function toggleAllNotifications() {
  for (let i = 0; i < notifications.value.length; i++) {
    notifications.value[i].read = selectAll.value
  }
}

function confirmDeleteAll() {
  notifications.value = []
  showDeleteAllModal.value = false
  deleteAll.value = false
}

function cancelDeleteAll() {
  showDeleteAllModal.value = false
  deleteAll.value = false
}

function confirmDeleteSelected() {
  notifications.value = notifications.value.filter(
    (_, index) => !selectedNotifications.value.includes(index),
  )
  selectedNotifications.value = []
  showDeleteSelectedModal.value = false
}

function cancelDeleteSelected() {
  showDeleteSelectedModal.value = false
}

function viewDetails(notification) {
  selectedNotificationDetails.value = notification
}
</script>

<style scoped>
.bg-image {
  background-image: url('@/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding-top: 100px;
}

.notifications-container {
  padding: 20px;
  background-color: #8fe4faa1;
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
  font-size: 20px;
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
  align-self: center;
}

.notification-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  align-self: center;
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

.btn-details {
  margin-left: auto;
  background-color: #ddd;
  padding: 6px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
  align-self: center;
}

.btn-details:hover {
  background-color: #ccc;
}

.no-more-notifications {
  text-align: center;
  font-size: 16px;
  color: #888;
  margin-top: 20px;
}
</style>
