<template>
  <NavigationBar>
    <template #content>
      <v-container fluid class="order-bg">
        <div class="order-container">
          <!-- Filter Buttons -->
          <div class="filter-buttons">
            <button
              :class="['btn-border', selectedFilter === 'All' ? 'active-filter' : '']"
              @click="filterOrders('All')"
            >
              ALL
            </button>
            <button
              :class="['btn-border', selectedFilter === 'To Deliver' ? 'active-filter' : '']"
              @click="filterOrders('To Deliver')"
            >
              IN PROGRESS
            </button>
            <button
              :class="['btn-border', selectedFilter === 'Completed' ? 'active-filter' : '']"
              @click="filterOrders('Completed')"
            >
              COMPLETED
            </button>
            <button
              :class="['btn-border', selectedFilter === 'Cancelled' ? 'active-filter' : '']"
              @click="filterOrders('Cancelled')"
            >
              CANCELLED
            </button>
          </div>

          <!-- Order Cards -->
          <transition-group name="fade" tag="div">
            <div class="order-card" v-for="(order, index) in filteredOrders" :key="order.id">
              <div class="order-info">
                <div class="order-top">
                  <strong>Order #{{ order.id }}</strong>
                  <span :class="['status', order.status.toLowerCase().replace(' ', '-')]">
                    {{ order.status }}
                  </span>
                </div>
                <p><strong>Water Refilling Station:</strong> {{ order.station }}</p>
                <p><strong>Date:</strong> {{ order.date }}</p>
                <p><strong>Quantity:</strong> {{ order.quantity }} gallons</p>
                <p><strong>Total:</strong> ₱{{ order.total.toFixed(2) }}</p>
              </div>
              <div class="order-actions">
                <div class="action-buttons" v-if="order.status === 'To Deliver'">
                  <button class="btn-border" @click="promptCancel(index)">Cancel Order</button>
                  <button class="btn-primary" @click="viewDetails(order)">View Details</button>
                </div>
                <div class="action-buttons" v-if="order.status === 'Completed'">
                  <router-link :to="order.router" class="btn-border no-underline"
                    >Re-Order</router-link
                  >
                  <button class="btn-primary" @click="openRateModal(order)">Rate</button>
                </div>

                <div class="action-buttons" v-if="order.status === 'Cancelled'">
                  <button class="btn-primary" @click="viewDetails(order)">View Details</button>
                </div>
              </div>
            </div>
          </transition-group>

          <!-- Cancel Modal -->
          <div class="modal" v-if="showCancelModal">
            <div class="modal-content">
              <p>Are you sure you want to cancel Order #{{ orders[cancelIndex].id }}?</p>
              <div class="modal-buttons">
                <button class="btn-primary" @click="cancelOrder">Yes</button>
                <button class="btn-border" @click="showCancelModal = false">No</button>
              </div>
            </div>
          </div>

          <!-- View Details Modal -->
          <div class="modal" v-if="showDetailsModal">
            <div class="modal-content" style="position: relative">
              <button
                style="
                  position: absolute;
                  top: 10px;
                  right: 10px;
                  background: none;
                  border: none;
                  font-size: 18px;
                  cursor: pointer;
                "
                @click="showDetailsModal = false"
              >
                ✖
              </button>
              <h3>Order #{{ selectedOrder?.id }}</h3>
              <div class="info-box">
                <h4><strong>Order Summary</strong></h4>
                <h5>{{ selectedOrder?.station }} Water Refilling Station  </h5>
                <p><strong>Order Date:</strong> {{ selectedOrder?.date }}</p>
                <p>
                  <strong>Status:</strong>
                  <span
                    :class="['status', selectedOrder?.status.toLowerCase().replace(' ', '-')]"
                    >{{ selectedOrder?.status }}</span
                  >
                </p>
                <p><strong>Payment Method:</strong> GCash </p>
              </div>
              <div class="info-box">
                <h4><strong>Order Details</strong></h4>
                <table>
                  <thead>
                    <tr>
                      <th>Order Type</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ selectedOrder?.orderType }}</td>
                      <td>{{ selectedOrder?.quantity }}</td>
                      <td>₱{{ (selectedOrder?.total / selectedOrder?.quantity).toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p>Subtotal: ₱{{ selectedOrder?.total.toFixed(2) }}</p>
                <p>Delivery Fee: ₱50.00</p>
                <p><strong>Total:</strong> ₱{{ (selectedOrder?.total + 50).toFixed(2) }}</p>
              </div>
              <div class="info-box">
                <h4><strong>Delivery Info</strong></h4>
                <p><strong>Address:</strong> {{ selectedOrder?.deliveryAddress }}</p>
                <p><strong>Expected Delivery:</strong> {{ selectedOrder?.deliveryDate }}</p>
              </div>
            </div>
          </div>

          <!-- Rate Modal -->
          <div class="modal" v-if="showRateModal">
            <div class="modal-content" style="position: relative">
              <button class="orderpage-close-btn"
                style="
                  position: absolute;
                  top: 20px;
                  right: 40px;
                  background: none;
                  border: none;
                  font-size: 22px;
                  color: #0557b6;

                "
                @click="showRateModal = false"
              >
                ✖
              </button>
                <v-card-title>How was your experience?</v-card-title>
                <v-card-text>
                  <v-rating
                    v-model="feedbacks.rating"
                    background-color="grey lighten-1"
                    color="yellow darken-2"
                    large
                    class=""
                  />
                  <v-textarea
                    v-model="feedbacks.comment"
                    label="Comment here..."
                    color="primary"
                    auto-grow
                  />
                    <div class="text-center ">
                    <v-btn class="mt-3 orderpage-submit-btn text-white" variant="none" @click="submitReview">Submit</v-btn>
                    </div>
                </v-card-text>

            </div>
          </div>
          <!-- Submission Success Modal -->
          <div class="modal" v-if="showSuccessModal">
            <div class="modal-content" style="text-align: center">
              <h3>✅ Submission Successful!</h3>
              <p>🎉 Thank you for your feedback!</p>
              <p>Your review helps improve the service of AquaPure Water Station.</p>
              <div class="modal-buttons">
                <button class="btn-primary" @click="closeSuccessModal">OK</button>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </template>
  </NavigationBar>
</template>

<script setup>
import { ref, reactive } from 'vue'
//import { useRouter } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'

const orders = ref([
  {
    id: 12345,
    date: 'April 18, 2025',
    station: 'Aquasis',
    quantity: 3,
    total: 180,
    orderType: 'Single Purchase',
    status: 'To Deliver',
    deliveryAddress: '123 Main St, Cityville',
    deliveryDate: 'April 20, 2025',
  },
  {
    id: 12346,
    date: 'April 10, 2025',
    station: 'Aquabon',
    quantity: 2,
    total: 120,
    orderType: 'Subscription',
    status: 'Completed',
    deliveryAddress: '456 Oak Rd, Townsville',
    deliveryDate: 'April 12, 2025',
    router: '/aquabon',
  },
  {
    id: 12347,
    date: 'April 15, 2025',
    station: 'Waterdrops',
    quantity: 5,
    total: 300,
    orderType: 'Single Purchase',
    status: 'Cancelled',
    deliveryAddress: '789 Pine Ln, Villagetown',
    deliveryDate: 'April 18, 2025',
  },
])

const selectedFilter = ref('All')
const filteredOrders = ref([...orders.value])

const showCancelModal = ref(false)
const showDetailsModal = ref(false)
//const showRateModal = ref(false)
//const showSuccessModal = ref(false)

const cancelIndex = ref(null)
const selectedOrder = ref(null)
const rating = ref(0)
const recommend = ref('')

const filterOrders = (status) => {
  selectedFilter.value = status
  filteredOrders.value =
    status === 'All' ? [...orders.value] : orders.value.filter((order) => order.status === status)
}

const promptCancel = (index) => {
  cancelIndex.value = index
  showCancelModal.value = true
}

const cancelOrder = () => {
  if (cancelIndex.value !== null) {
    orders.value[cancelIndex.value].status = 'Cancelled'
    filterOrders(selectedFilter.value) // Refresh filtered list
    showCancelModal.value = false
  }
}

const viewDetails = (order) => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const openRateModal = (order) => {
  selectedOrder.value = order
  rating.value = 0
  recommend.value = ''
  showRateModal.value = true
}

import { useReviewStore } from '@/stores/reviewStore'

// State for modal visibility
const showRateModal = ref(false)
const showSuccessModal = ref(false)

// Reactive state for feedback
const feedbacks = reactive({
  rating: 0,
  comment: ''
})
const stationId = 'station-123' // This should come from the actual order/station
// Mocked user data (replace with actual user data from auth system)
const currentUser = {
  username: 'Mae',
  email: 'mae@example.com',
  profilePhoto: 'https://i.pravatar.cc/100?u=mae@example.com' // use default or from DB
}

// Access the review store
const reviewStore = useReviewStore()

// Function to submit the review
const submitReview = () => {
  reviewStore.addReview(stationId, {
    rating: feedbacks.rating,
    comment: feedbacks.comment
  }, currentUser)

  // Close the rating modal and show success modal
  showRateModal.value = false
  showSuccessModal.value = true
}

// Function to close the success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false
}
</script>

<style scoped>
.order-bg {
  background-image: url('@/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding-top: 100px;
}

.order-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 12px;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-border {
  background-color: transparent;
  border: 1px solid #02adef;
  color: #02adef;
  padding: 4px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  align-self: center;
}

.btn-border:hover {
  background-color: #02adef;
  color: white;
}

.active-filter {
  background-color: #02adef;
  color: white;
}

.order-card {
  background: #d3eaff;
  padding: 12px;
  border-radius: 5px;
  margin: 10px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  font-size: 14px;
  transition: all 0.4s ease;
}

.order-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.status {
  font-weight: bold;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 13px;
}

.status.to-deliver {
  background-color: #f9c74f;
  color: #000;
}

.status.completed {
  background-color: #90be6d;
  color: white;
}

.status.cancelled {
  background-color: #ef476f;
  color: white;
}

.btn-primary {
  background-color: #02adef;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #028ac7;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.no-underline {
  text-decoration: none;
}

.action-buttons a {
  min-width: 90px;
  text-align: center;
}

.info-box {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.info-box h4 {
  margin-bottom: 10px;
  font-size: 16px;
}
.info-box h5 {
  font-size: 14px;
}

.info-box p {
  margin: 5px 0;
  font-size: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

table th {
  background-color: #f2f2f2;
}

.star {
  font-size: 28px;
  color: #ccc;
  cursor: pointer;
  margin: 0 3px;
}

.star.filled {
  color: gold;
}

.recommend-box {
  margin: 15px 0;
}

/**Rate Modal Style */
.orderpage-submit-btn{
  font-family: 'inter', sans-serif;
  text-transform: none;
  border-radius: 0 15px;
  border: 2px solid #0557b6;
  width: 50%;
  font-weight: 600;
}
.orderpage-submit-btn{
  background-color: #0557b6;
  border-radius: 5px;
}
.modal-content .v-card-title{
  font-family: 'familjen grotesk', sans-serif;
  font-size: 19px;
  color: #0557b6;
  font-weight: 600;
}
.orderpage-submit-btn:hover{
  background-color: #02adef;
  border-color: #02adef;
  color: #fff !important;
}
.orderpage-close-btn:hover{
  color:#02adef !important;
}
</style>
