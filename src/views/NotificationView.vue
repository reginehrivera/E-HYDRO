<template>
  <NavigationBar>
    <template #content>
      <v-container fluid class="bg-image">
        <div class="notifications-modal">
          <div class="notifications-container">
            <div class="notification-header">
              <div class="title-close-wrapper">
                <h2 class="notification-title">All Notifications</h2>
                <button class="close-button" @click="closeNotifications">
                  <v-icon>mdi-close</v-icon>
                </button>
              </div>
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

            <!-- Display a message when there are no notifications -->
            <div v-if="combinedNotifications.length === 0" class="no-notifications">
              <v-icon large>mdi-bell-off-outline</v-icon>
              <p>No notifications available</p>
            </div>

            <div
              v-for="(notification, index) in combinedNotifications.slice(0, visibleNotifications)"
              :key="notification.id || index"
              class="notification-item"
              :class="{ read: !notification.isNew, 'new-notification': notification.isNew }"
            >
              <input
                type="checkbox"
                v-model="selectedNotifications"
                :value="index"
                class="checkbox-left"
              />
              <div class="notification-icon-wrapper">
                <v-icon
                  class="notification-icon"
                  :class="getNotificationIconClass(notification.type)"
                >
                  {{ getNotificationIcon(notification.type) }}
                </v-icon>
              </div>
              <div class="notification-content">
                <strong>{{ notification.title }}</strong>
                <p>{{ notification.message }}</p>
                <span class="timestamp">{{ notification.date || notification.timestamp }}</span>
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

              <button v-if="showLoadMore" class="btn-secondary" @click="loadMoreNotifications">
                Load More Notifications
              </button>
            </div>

            <div
              v-if="!showLoadMore && combinedNotifications.length > 0"
              class="no-more-notifications"
            >
              No more notifications.
            </div>
          </div>
        </div>

        <!-- Modals -->
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
            <p>
              <strong>Date Received:</strong>
              {{ selectedNotificationDetails.date || selectedNotificationDetails.timestamp }}
            </p>
            <div class="modal-buttons">
              <button
                @click="
                  () => {
                    markAsRead(selectedNotificationDetails)
                    selectedNotificationDetails = null
                  }
                "
                class="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </v-container>
    </template>
  </NavigationBar>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import galloonIcon from '@/assets/img/icons/galloon.png'
import confirmIcon from '@/assets/img/icons/confirm.jpg'
import voucherIcon from '@/assets/img/icons/voucher.png'
import waterIcon from '@/assets/img/icons/water.png'
import noteIcon from '@/assets/img/icons/note.png'
import bellIcon from '@/assets/img/icons/bell.png'
import announceIcon from '@/assets/img/icons/announce.png'
import warningIcon from '@/assets/img/icons/warning.png'

// Import order store to ensure we have access to the latest notification data
import { useOrderStore } from '@/stores/orders'
import { supabase } from '@/supabase'

const orderStore = useOrderStore()

// Inject the notifications from NavigationBar
const orderNotifications = inject('orderNotifications', ref([]))
const allNotifications = inject('allNotifications', ref([]))

// Static notifications (for demo/fallback)
const staticNotifications = ref([
  {
    title: 'Order Confirmed',
    message: 'Your order #12345 is confirmed. Expect delivery on March 31, 2025.',
    icon: confirmIcon,
    read: false,
    date: 'March 27, 2025',
    type: 'completed',
    isNew: false,
    id: 'static-1',
  },
  {
    title: 'Your Order is on the Way',
    message: 'Great news! Your water delivery is out for delivery. Stay hydrated!',
    icon: galloonIcon,
    read: false,
    date: 'March 28, 2025',
    type: 'progress',
    isNew: false,
    id: 'static-2',
  },
  {
    title: 'Claim Your Discount Voucher',
    message: 'Hi Regine, you have a 10% OFF voucher valid until March 30, 2025.',
    icon: voucherIcon,
    read: false,
    date: 'March 25, 2025',
    type: 'info',
    isNew: false,
    id: 'static-3',
  },
  {
    title: 'New Water Station Near You',
    message: "We've partnered with a new clean & safe water refill station in your area!",
    icon: waterIcon,
    read: false,
    date: 'March 22, 2025',
    type: 'info',
    isNew: false,
    id: 'static-4',
  },
  {
    title: 'Profile Updated',
    message: 'Your profile information was successfully saved.',
    icon: noteIcon,
    read: false,
    date: 'March 20, 2025',
    type: 'info',
    isNew: false,
    id: 'static-5',
  },
  {
    title: 'System Update',
    message: 'A new system update is available.',
    icon: bellIcon,
    read: false,
    date: 'March 19, 2025',
    type: 'info',
    isNew: false,
    id: 'static-6',
  },
  {
    title: 'Event Reminder',
    message: 'Reminder: Event at 3 PM today.',
    icon: announceIcon,
    read: false,
    date: 'March 18, 2025',
    type: 'info',
    isNew: false,
    id: 'static-7',
  },
  {
    title: 'Maintenance Scheduled',
    message: 'Scheduled maintenance will occur tomorrow at midnight.',
    icon: announceIcon,
    read: false,
    date: 'March 17, 2025',
    type: 'info',
    isNew: false,
    id: 'static-8',
  },
])

// Combine notifications from all sources with proper priority
const combinedNotifications = computed(() => {
  // First, check allNotifications (comprehensive list from NavigationBar)
  if (allNotifications.value && allNotifications.value.length > 0) {
    console.log('Using allNotifications:', allNotifications.value.length)
    return allNotifications.value
  }

  // Next, check orderNotifications
  if (orderNotifications.value && orderNotifications.value.length > 0) {
    console.log('Using orderNotifications:', orderNotifications.value.length)
    return orderNotifications.value
  }

  // Finally, fall back to static notifications
  console.log('Using staticNotifications:', staticNotifications.value.length)
  return staticNotifications.value
})

const visibleNotifications = ref(5)
const showLoadMore = ref(true)
const selectAll = ref(false)
const deleteAll = ref(false)
const selectedNotifications = ref([])
const showDeleteAllModal = ref(false)
const showDeleteSelectedModal = ref(false)
const selectedNotificationDetails = ref(null)
const router = useRouter() // Add the router import

// Update load more function to use combined notifications length
function loadMoreNotifications() {
  // Show all remaining notifications when Load More is clicked
  visibleNotifications.value = combinedNotifications.value.length
  showLoadMore.value = false
}

// Get proper notification icon based on type
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

// Get CSS class for notification icon
function getNotificationIconClass(type) {
  switch (type) {
    case 'progress':
      return 'progress-icon'
    case 'cancelled':
      return 'cancelled-icon'
    case 'completed':
      return 'completed-icon'
    default:
      return 'info-icon'
  }
}

function toggleAllNotifications() {
  // Toggle isNew status for all notifications
  combinedNotifications.value.forEach((notification) => {
    notification.isNew = !selectAll.value
    notification.read = selectAll.value
  })

  // Also update in other notification lists
  if (orderNotifications.value) {
    orderNotifications.value.forEach((notification) => {
      notification.isNew = !selectAll.value
      notification.read = selectAll.value
    })
  }

  if (allNotifications.value) {
    allNotifications.value.forEach((notification) => {
      notification.isNew = !selectAll.value
      notification.read = selectAll.value
    })
  }
}

function markAsRead(notification) {
  if (notification) {
    notification.isNew = false
    notification.read = true

    // Also update the same notification in other notification lists
    // This ensures consistency between navbar and notification page

    // Update in orderNotifications list
    if (orderNotifications.value) {
      const index = orderNotifications.value.findIndex(
        (n) =>
          n.id === notification.id ||
          (n.message === notification.message && n.title === notification.title),
      )

      if (index !== -1) {
        orderNotifications.value[index].isNew = false
        orderNotifications.value[index].read = true
      }
    }

    // Update in allNotifications list
    if (allNotifications.value) {
      const index = allNotifications.value.findIndex(
        (n) =>
          n.id === notification.id ||
          (n.message === notification.message && n.title === notification.title),
      )

      if (index !== -1) {
        allNotifications.value[index].isNew = false
        allNotifications.value[index].read = true
      }
    }
  }
}

function confirmDeleteAll() {
  // Clear all notifications
  if (allNotifications.value) {
    allNotifications.value = []
  }
  if (orderNotifications.value) {
    orderNotifications.value = []
  }
  staticNotifications.value = []

  showDeleteAllModal.value = false
  deleteAll.value = false
}

function cancelDeleteAll() {
  showDeleteAllModal.value = false
  deleteAll.value = false
}

function confirmDeleteSelected() {
  const selected = new Set(selectedNotifications.value)

  // Create new arrays without the selected notifications
  if (allNotifications.value) {
    allNotifications.value = allNotifications.value.filter((_, index) => !selected.has(index))
  }
  if (orderNotifications.value) {
    orderNotifications.value = orderNotifications.value.filter((_, index) => !selected.has(index))
  }
  staticNotifications.value = staticNotifications.value.filter((_, index) => !selected.has(index))

  selectedNotifications.value = []
  showDeleteSelectedModal.value = false
}

function cancelDeleteSelected() {
  showDeleteSelectedModal.value = false
}

function viewDetails(notification) {
  selectedNotificationDetails.value = notification
  markAsRead(notification)
}

// Function to close notifications and navigate back
function closeNotifications() {
  // Navigate back to the previous page or to home
  router.push('/home')
}

// Fetch notifications from server if needed
async function fetchServerNotifications() {
  try {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return

    const userId = userData.user.id

    // Always fetch more notifications to ensure we have enough for the "Load More" functionality
    if (true) {
      console.log('Fetching notifications from server')

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error fetching orders for notifications:', error)
        return
      }

      if (data && data.length > 0) {
        // Convert orders to notifications
        const newNotifications = data.map((order) => {
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
            date: new Date(order.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            isNew: order.status === 'To Deliver' || order.status === 'Processing',
            id: `order-${order.id}`,
            read: false,
          }
        })

        // If we have injected ref objects, update them
        if (allNotifications.value) {
          allNotifications.value = [...newNotifications]
        }
        if (orderNotifications.value) {
          orderNotifications.value = [...newNotifications]
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch notifications:', err)
  }
}

// Initialize data on mount
onMounted(() => {
  console.log('Notification page mounted')
  console.log('orderNotifications length:', orderNotifications.value?.length)
  console.log('allNotifications length:', allNotifications.value?.length)

  // Try to fetch notifications if not available
  fetchServerNotifications()

  // Update the showLoadMore flag based on the initial number of notifications
  if (visibleNotifications.value >= combinedNotifications.value.length) {
    showLoadMore.value = false
  } else {
    showLoadMore.value = true
  }
})
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
  position: relative;
}

/* Modal-like appearance for the entire notification page */
.notifications-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Transparent black overlay */
  backdrop-filter: blur(8px); /* Blurred background effect */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  overflow-y: auto;
}

.notifications-container {
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent white */
  border-radius: 10;
  max-width: 1000px;
  width: 90%;
  max-height: 90vh;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.notification-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 15px;
}

.title-close-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.close-button {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: rgba(255, 0, 0, 0.842);
}

.close-button .v-icon {
  font-size: 22px;
  color: #333;
}

.v-icon:hover {
  color: #ffffff;
}

.notification-actions label {
  margin-left: 15px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.notification-actions input[type='checkbox'] {
  margin-right: 5px;
}

.notification-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
}

/* New notification styling */
.new-notification {
  background-color: rgba(255, 255, 255, 0.95); /* Whiter background for new notifications */
  border-left: 4px solid #19a3ff; /* Purple accent for new notifications */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Read notification styling */
.notification-item.read {
  background-color: rgba(240, 240, 240, 0.8); /* Light gray for read notifications */
  border-left: none;
}

/* Type-specific notification styling */
.notification-item .notification-icon.progress-icon {
  color: #2196f3; /* Blue for in-progress */
}

.notification-item .notification-icon.cancelled-icon {
  color: #f44336; /* Red for cancelled */
}

.notification-item .notification-icon.completed-icon {
  color: #4caf50; /* Green for completed */
}

.notification-item .notification-icon.info-icon {
  color: #ff9800; /* Orange for info */
}

/* Icon wrapper */
.notification-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: 16px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
}

/* Notification content */
.notification-content {
  flex: 1;
}

.notification-content strong {
  font-weight: 600;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 6px;
  color: #333;
}

.notification-content p {
  margin: 0;
  color: #555;
  line-height: 1.4;
}

.timestamp {
  display: block;
  font-size: 0.8rem;
  color: #757575;
  margin-top: 8px;
}

/* Checkbox styling */
.checkbox-left {
  margin-right: 16px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Button styling */
.btn-details {
  background-color: transparent;
  color: #00c3ff;
  border: 1px solid #0099ff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.btn-details:hover {
  background-color: #19a3ff;
  color: white;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 25px;
  justify-content: center;
}

.btn-primary {
  background-color: #f73636;
  color: white;
  border: none;
  padding: 5px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background-color: #ff0202;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background-color: #19a3ff;
  color: white;
  border: none;
  padding: 5px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  background-color: #0285ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-border {
  background-color: transparent;
  border: 2px solid #333;
  color: #333;
  padding: 10px 24px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-border:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

/* Modal styling */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 16px;
  max-width: 400px;
  width: 80%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-content h3 {
  margin-top: 0;
  font-size: 20px;
  color: #333;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

/* No notifications message */
.no-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #757575;
}

.no-notifications .v-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
  color: #666;
}

.no-more-notifications {
  text-align: center;
  padding: 20px;
  color: #757575;
  font-style: italic;
}

/* For screens smaller than 768px (mobile) */
@media (max-width: 768px) {
  .notifications-container {
    padding: 20px;
    width: 95%;
  }

  .notification-actions {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .notification-actions label {
    margin-left: 0;
    font-size: 14px;
  }

  .notification-item {
    flex-wrap: wrap;
  }

  .btn-details {
    margin-top: 10px;
    width: 100%;
  }

  .button-group {
    flex-direction: column;
  }

  .close-button {
    width: 32px;
    height: 32px;
  }

  .close-button .v-icon {
    font-size: 20px;
  }
}
</style>
