<template>
  <div class="notifications-container">
    <h2>All Notifications</h2>
    <div v-for="(notification, index) in notifications" :key="index" class="notification-item">
      <strong>{{ notification.title }}:</strong> {{ notification.message }}
    </div>
    <button @click="loadMoreNotifications" v-if="showLoadMore">Load More</button>
  </div>
</template>

<script>
import NavigationBar from '@/components/layout/NavigationBar.vue'

export default {
  name: 'Notification',
  data() {
    return {
      notifications: [
        { title: 'Order Confirmed', message: 'Your order #12345 is confirmed.' },
        { title: 'On the Way', message: 'Your delivery is out for delivery.' },
        { title: 'Discount', message: '10% voucher available until March 30.' },
        { title: 'New Station', message: 'We’ve added a new station near you.' },
        { title: 'Profile Updated', message: 'Your profile information was successfully saved.' },
        { title: 'System Update', message: 'A new system update is available.' },
        { title: 'Event Reminder', message: 'Reminder: Event at 3 PM today.' },
        { title: 'Maintenance', message: 'Scheduled maintenance will occur tomorrow at midnight.' },
      ],
      visibleNotifications: 5, // Number of notifications to show initially
      showLoadMore: true, // Control visibility of "Load More" button
    }
  },
  methods: {
    loadMoreNotifications() {
      if (this.visibleNotifications < this.notifications.length) {
        this.visibleNotifications += 5 // Show 5 more notifications
      } else {
        this.showLoadMore = false // Hide the button when no more notifications
      }
    },
  },
}
</script>

<style scoped>
.notifications-container {
  padding: 20px;
}

.notification-item {
  font-size: 14px;
  margin-bottom: 10px;
}

button {
  background-color: #02adef;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;
  border-radius: 5px;
}

button:hover {
  background-color: #0281b5;
}
</style>
