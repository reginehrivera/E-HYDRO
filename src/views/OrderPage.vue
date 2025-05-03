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

          <!-- Loading Indicator -->
          <div class="loading-state" v-if="isLoading">
            <div class="loading-content">
              <v-progress-circular indeterminate color="#02adef" size="50"></v-progress-circular>
              <h3 class="mt-4">Loading your orders...</h3>
            </div>
          </div>

          <!-- Empty State Message - Only show when not loading and no orders -->
          <div class="empty-state" v-else-if="filteredOrdersStore.length === 0">
            <div class="empty-state-content">
              <v-icon size="64" color="#02adef">mdi-cart-outline</v-icon>
              <h3>No Orders Found</h3>
              <p>You haven't placed any orders yet.</p>
              <router-link to="/aquabon" class="btn-primary no-underline"> Order Now </router-link>
            </div>
          </div>

          <!-- Order Cards - Show when not loading and has orders -->
          <transition-group name="fade" tag="div" v-else>
            <div class="order-card" v-for="(order, index) in filteredOrdersStore" :key="order.id">
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
              <p>
                Are you sure you want to cancel Order #{{ filteredOrdersStore[cancelIndex]?.id }}?
              </p>
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
                <h5>{{ selectedOrder?.station }} Water Refilling Station</h5>
                <p><strong>Order Date:</strong> {{ selectedOrder?.date }}</p>
                <p>
                  <strong>Status:</strong>
                  <span
                    :class="['status', selectedOrder?.status.toLowerCase().replace(' ', '-')]"
                    >{{ selectedOrder?.status }}</span
                  >
                </p>
                <p><strong>Payment Method:</strong> GCash</p>
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
              <button
                class="orderpage-close-btn"
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
                  half-increments
                  hover
                  class=""
                />
                <v-textarea
                  v-model="feedbacks.comment"
                  label="Comment here..."
                  color="primary"
                  auto-grow
                />
                <div class="text-center">
                  <v-btn
                    class="mt-3 orderpage-submit-btn text-white"
                    variant="none"
                    @click="submitReview"
                    >Submit</v-btn
                  >
                </div>
              </v-card-text>
            </div>
          </div>

          <!-- Submission Success Modal -->
          <div class="modal" v-if="showSuccessModal">
            <div class="modal-content" style="text-align: center">
              <p>🎉 Thank you for your feedback!</p>
              <p>Your review helps improve the service of Aquabon Water Refilling Station.</p>
              <div>
                <router-link to="/aquabon#review-section">
                  <v-btn class="submission-view-btn mt-3">View review</v-btn>
                </router-link>
              </div>
              <div class="">
                <v-btn class="submission-back-btn mt-1" @click="closeSuccessModal">Back</v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </template>
  </NavigationBar>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useOrderStore } from '@/stores/orders'
import { useReviewStore } from '@/stores/reviewStore'
import NavigationBar from '@/components/layout/NavigationBar.vue'

// Get router and stores
const router = useRouter()
const orderStore = useOrderStore()
const reviewStore = useReviewStore()

// State management
const selectedFilter = ref('All')
const showCancelModal = ref(false)
const cancelIndex = ref(null)
const showDetailsModal = ref(false)
const selectedOrder = ref(null)
const showRateModal = ref(false)
const showSuccessModal = ref(false)
const isLoading = ref(true) // Add loading state flag

// Compute filtered orders based on selected filter
const filteredOrdersStore = computed(() => {
  // Use orderStore.orders if available, otherwise fallback to empty array
  const list = orderStore.orders.length > 0 ? orderStore.orders : []

  if (selectedFilter.value === 'All') return list
  return list.filter((o) => o.status === selectedFilter.value)
})

// Feedback form data
const feedbacks = reactive({
  rating: 0,
  comment: '',
})

const stationId = 'station-123'

// User data
const currentUser = reactive({
  username: '',
  email: '',
  profilePhoto: '',
})

// Filter orders by status
const filterOrders = (status) => {
  selectedFilter.value = status
}

// Prompt user to confirm cancellation
function promptCancel(idx) {
  cancelIndex.value = idx
  showCancelModal.value = true
}

// Cancel order function
async function cancelOrder() {
  try {
    // Get the order to cancel from the filtered list
    const targetOrder = filteredOrdersStore.value[cancelIndex.value]
    if (!targetOrder) {
      console.error('Order not found in the filtered list')
      alert('Failed to cancel the order: Order not found')
      showCancelModal.value = false
      return
    }

    // Find the order in the main store
    const index = orderStore.orders.findIndex((o) => o.id === targetOrder.id)
    if (index === -1) {
      console.error('Order not found in the store')
      alert('Failed to cancel the order: Order not found in store')
      showCancelModal.value = false
      return
    }

    // Update order status in Supabase first
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'Cancelled' })
      .eq('id', targetOrder.id)

    if (error) {
      console.error('Error updating order in database:', error)
      alert('Failed to cancel the order: Database error')
      showCancelModal.value = false
      return
    }

    // If database update successful, update local state
    orderStore.orders[index] = {
      ...orderStore.orders[index],
      status: 'Cancelled',
    }

    console.log('Order successfully cancelled:', targetOrder.id)
    showCancelModal.value = false

    // Force switch to the Cancelled tab to show the user their cancelled order
    selectedFilter.value = 'Cancelled'
  } catch (err) {
    console.error('Unexpected error in cancelOrder:', err)
    alert('An unexpected error occurred while cancelling your order')
    showCancelModal.value = false
  }
}

// Show order details modal
function viewDetails(order) {
  selectedOrder.value = order
  showDetailsModal.value = true
}

// Open rating modal
const openRateModal = (order) => {
  selectedOrder.value = order
  feedbacks.rating = 0
  feedbacks.comment = ''
  showRateModal.value = true
}

// Submit review function
const submitReview = async () => {
  if (feedbacks.rating === 0 || feedbacks.comment.trim() === '') {
    alert('Please provide a rating and a comment before submitting.')
    return
  }

  // Step 1: Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    alert('User not logged in.')
    return
  }

  // Step 2: Get user profile (full_name, email, avatar_url)
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', user.id)
    .single()

  if (profileError || !profileData) {
    console.error('Profile fetch error:', profileError)
    alert('Failed to get user profile info.')
    return
  }

  // Step 3: Get order info (station_name)
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('station_name')
    .eq('id', selectedOrder.value.id)
    .single()

  if (orderError || !orderData) {
    console.error('Order fetch error:', orderError)
    alert('Failed to get order info.')
    return
  }

  // Step 4: Insert into feedbacks table
  const { error } = await supabase.from('feedbacks').insert({
    rating: feedbacks.rating,
    comment: feedbacks.comment,
    created_at: new Date().toISOString(),
    order_id: selectedOrder.value.id,
    user_id: user.id,
    full_name: profileData.full_name,
    email: profileData.email,
    station_name: orderData.station_name,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    alert('Failed to submit review.')
    return
  }

  // Step 5: Save to local store
  reviewStore.addReview(
    stationId,
    {
      rating: feedbacks.rating,
      comment: feedbacks.comment,
    },
    {
      username: profileData.full_name,
      email: profileData.email,
      profilePhoto: profileData.avatar_url,
    },
  )

  // Step 6: Reset UI
  showRateModal.value = false
  showSuccessModal.value = true
}

// Close success modal
const closeSuccessModal = () => {
  showSuccessModal.value = false
}

// Load orders on component mount
onMounted(async () => {
  // Set loading state to true at the beginning
  isLoading.value = true

  try {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) {
      router.push('/login')
      return
    }

    const { data: rows, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('could not load orders', error)
      return
    }

    const mapped = rows.map((r) => ({
      id: r.id,
      date: new Date(r.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      station: r.station || 'Aquabon',
      quantity: r.quantity,
      total: r.total_price,
      orderType: r.order_type || 'Refill Only',
      status: r.status,
      deliveryAddress: r.address || '—',
      deliveryDate: new Date(r.calendar).toLocaleDateString(),
      router: '/aquabon',
    }))

    orderStore.setOrders(mapped)
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    // Turn off loading state when done (whether success or error)
    // Add a small delay to ensure the loading animation is visible
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
})
</script>

<style scoped>
/* Loading state styling */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.loading-content h3 {
  margin-top: 16px;
  color: #000000;
  font-weight: 800;
}

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

.modal-content p {
  margin: 0;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
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
.orderpage-submit-btn {
  font-family: 'inter', sans-serif;
  text-transform: none;
  border-radius: 0 15px;
  border: 2px solid #0557b6;
  width: 50%;
  font-weight: 600;
}
.orderpage-submit-btn {
  background-color: #0557b6;
  border-radius: 5px;
}
.modal-content .v-card-title {
  font-family: 'familjen grotesk', sans-serif;
  font-size: 19px;
  color: #0557b6;
  font-weight: 600;
}
.orderpage-submit-btn:hover {
  background-color: #02adef;
  border-color: #02adef;
  color: #fff !important;
}
.orderpage-close-btn:hover {
  color: #02adef !important;
}

.submission-back-btn {
  text-transform: none;
  color: #fff;
  background-color: #02adef;
}
.submission-view-btn {
  text-transform: none;
  color: #0557b6;
  border: 1px #02adef solid;
}
.submission-back-btn:hover {
  color: #0557b6;
}
.submission-view-btn:hover {
  color: #0557b6;
  border: #02adef 1px solid;
  background-color: #02adef;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
  background-color: #d3eaff;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 800px;
}

.empty-state-content {
  text-align: center;
}

.empty-state h3 {
  margin-top: 20px;
  font-size: 22px;
  color: #0557b6;
}

.empty-state p {
  margin: 10px 0 20px;
  color: #666;
}

.empty-state .btn-primary {
  display: inline-block;
  padding: 8px 20px;
  font-size: 16px;
  text-decoration: none;
}
</style>
