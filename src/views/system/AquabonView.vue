<template>
  <NavigationBar>
    <template #content>
      <StationLayout>
        <template #dashboardcontent>
          <!--Card Station Area-->
          <v-container class="station-container" elevation="24">
            <v-row class="top-style">
              <v-col cols="6">
                <h2>{{ station.name }}</h2>
              </v-col>
              <v-col cols="6" class="text-end">
                <router-link to="/station" class="no-underline">
                  <v-icon class="close">mdi-window-close</v-icon>
                </router-link>
              </v-col>
            </v-row>
            <!--Left Column-->
            <v-row>
              <v-col cols="12" md="5">
                <v-container class="left-container">
                  <v-row class="img-row">
                    <v-col cols="12" class="img-style d-flex">
                      <img
                        src="@/assets/img/aquabon-img.jpg"
                        height="250"
                        width="380"
                        class="responsive-img mx-auto"
                        alt="Aquasis image"
                      />
                    </v-col>
                  </v-row>
                  <!--Description-->
                  <v-container class="description-card">
                    <v-row class="description-row">
                      <v-col cols="12" md="7" class="description shrink-line">
                        <p class="shrink-line">
                          <v-icon class="blue-color">mdi-map-marker</v-icon>177 Cancer St. Montilla
                          Blvd Highway, Guingona Subdivision Brgy JP Rizal, Butuan City, Philippines
                        </p>
                      </v-col>
                      <v-col cols="12" md="5" class="description text-end shrink-line">
                        <h3 class="blue-color"><b>₱25.00</b></h3>
                        <p4 class="blue-color">per gallon</p4><br />
                        <span>No Delivery Fee</span>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-container class="contact-btn text-center">
                        <v-row>
                          <v-col cols="12" sm="6" class="d-flex justify-center mb-2 mb-sm-0">
                            <router-link to="" class="no-underline w-100">
                              <v-btn
                                class="social-contact w-100"
                                rounded="0"
                                variant="flat"
                                prepend-icon="mdi-facebook-messenger"
                              >
                                <span class="text-center">Messenger</span>
                                <v-tooltip activator="parent" location="bottom"
                                  >Madam Bertud</v-tooltip
                                >
                              </v-btn>
                            </router-link>
                          </v-col>
                          <v-col cols="12" sm="6" class="d-flex justify-center">
                            <router-link to="" class="no-underline w-100">
                              <v-btn
                                class="social-contact w-100"
                                rounded="0"
                                variant="flat"
                                prepend-icon="mdi-phone"
                              >
                                <span class="text-center">Phone Number</span>
                                <v-tooltip activator="parent" location="bottom"
                                  >09517978870</v-tooltip
                                >
                              </v-btn>
                            </router-link>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>

                  <v-divider :thickness="2"></v-divider>
                  <!---RATING AND COMMENTS WILL REFLECT THIS AREA-->
                  <p class="review-style pl-8 pt-2">
                    {{ averageRating }} <v-icon color="yellow darken-2">mdi-star</v-icon> Ratings
                    ({{ reviews.length }})
                    <v-tooltip activator="parent" location="right"
                      >Scroll down to view more reviews!</v-tooltip
                    >
                  </p>
                  <v-container id="review-section" class="modal-content">
                    <v-card
                      v-for="(review, index) in reviews"
                      :key="index"
                      class="mb-1 pl-5 pr-5 review-card"
                    >
                      <v-card-title class="d-flex align-center pt-2">
                        <v-row>
                          <v-col cols="12" md="2" class="">
                            <v-avatar size="40" class="pl-4">
                              <img :src="review.profilePhoto" alt="Profile" />
                            </v-avatar>
                          </v-col>
                          <v-col cols="12" md="10">
                            <div>
                              <P class="profile-name-style">{{ review.username }}</P>
                            </div>
                            <div class="text-caption">
                              <p class="profile-email-style">{{ review.email }}</p>
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-title>
                      <v-rating
                        :model-value="review.rating"
                        density="compact"
                        readonly
                        color="yellow darken"
                        class="review-star pl-4"
                      />
                      <v-card-text
                        ><p class="review-comment pl-2">{{ review.comment }}</p></v-card-text
                      >
                    </v-card>
                  </v-container>

                  <!----->
                </v-container>
              </v-col>
              <!--End Left Column-->
              <!--Right Column-->
              <v-col cols="12" md="7" class="d-flex flex-column align-center">
                <v-date-picker
                  v-if="showCalendar"
                  v-model="selectedDate"
                  :min="new Date().toISOString().substr(0, 10)"
                  show-adjacent-months
                  class="custom-calendar"
                  hide-header="false"
                  width="600"
                  color="#FD7B38"
                  :selected-color="'#FD7B38'"
                  >+
                  <template #actions>
                    <v-btn @click="showCalendar = false" color="red" text>Cancel</v-btn>
                    <v-btn @click="confirmDateSelection" color="green" text>Confirm</v-btn>
                  </template>
                </v-date-picker>

                <v-container class="right-container" ref="ordersContainer">
                  <div class="scrollable-content">
                    <v-container
                      v-for="(order, index) in orders"
                      :key="index"
                      :ref="`order-${index}`"
                    >
                      <v-row class="first-row">
                        <v-col cols="6" class="grp-checkbox">
                          <h4 class="blue-color">Order Option</h4>
                          <div class="checkboxes">
                            <div class="checkbox-one">
                              <v-checkbox
                                v-model="order.selected"
                                label="Refill Only"
                                value="Refill Only"
                                color="primary"
                                class="checkbox-top"
                                @change="handleOptionChange"
                              ></v-checkbox>
                            </div>
                            <div class="checkbox-two">
                              <v-checkbox
                                v-model="order.selected"
                                label="Buy with New Gallon (₱100)"
                                value="Buy with New Gallon (₱100)"
                                color="primary"
                                class="checkbox-bottom"
                                @change="handleOptionChange"
                              ></v-checkbox>
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <h4 class="blue-color mb-3">Delivery Address Option</h4>
                          <v-select
                            v-model="order.address"
                            :items="items"
                            label="Select Address..."
                          />
                        </v-col>
                      </v-row>

                      <v-divider></v-divider>

                      <v-row class="second-row">
                        <v-col cols="12" md="2">
                          <v-card class="text-center card-img" width="95">
                            <img src="@/assets/img/gallon-aquabon.png" />
                          </v-card>
                        </v-col>
                        <v-col cols="12" md="10" class="pl-6">
                          <v-row>
                            <v-col cols="12">
                              <h5 class="blue-color">{{ station.name }}</h5>
                              <h6>
                                Location: 177 Cancer St., Montilla Blvd Highway, Brgy JP Rizal
                              </h6>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" md="6">
                              <p class="text-h6">₱ 25.00 per gallon</p>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-container d-flex align-center class="btn-group">
                                <v-row>
                                  <v-btn
                                    rounded="0"
                                    class="btn-minus"
                                    variant="plain"
                                    size="small"
                                    @click="() => decreaseGallon(index)"
                                  >
                                    <v-icon>mdi-minus</v-icon>
                                  </v-btn>
                                  <p class="text-h6 text-center">{{ order.quantity }}</p>
                                  <v-btn
                                    rounded="0"
                                    class="btn-plus"
                                    variant="plain"
                                    size="small"
                                    @click="() => increaseGallon(index)"
                                  >
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                </v-row>
                              </v-container>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>

                      <v-divider></v-divider>

                      <div class="text-center">
                        <v-btn rounded="0" class="add-address-btn mt-2 mb-4" @click="addNewOrder">
                          <v-icon class="pr-3 text-center text-primary" size="large">
                            mdi-plus-circle-outline
                          </v-icon>
                          <span class="text-dark">Place a new order for another location</span>
                        </v-btn>
                      </div>

                      <div class="total-right mb-3">
                        <p>Subtotal: ₱{{ getSubtotal(order) }}.00</p>
                        <p v-if="order.quantity >= 12" class="discount-text">
                          Discount: -₱{{ getDiscount(order) }}.00
                        </p>
                      </div>

                      <v-row class="cancel-order-btns" v-if="orders.length > 1">
                        <v-col cols="12" md="6" class="text-start">
                          <v-btn variant="none" class="cancel-btn" @click="cancelOrder(index)"
                            >Cancel</v-btn
                          >
                        </v-col>
                        <v-divider class="my-4"></v-divider>
                      </v-row>
                    </v-container>
                  </div>

                  <div class="text-end">
                    <v-divider class="my-4"></v-divider>

                    <div class="d-flex justify-space-between align-start mb-4">
                      <!-- Payment Method LEFT -->
                      <div class="text-left">
                        <h4 class="text-start" style="margin-bottom: 9px">Payment Method:</h4>
                        <v-select
                          v-model="paymentMethod"
                          label="Select Payment Method"
                          :items="['Cash on Delivery', 'GCash']"
                          variant="outlined"
                          density="compact"
                          hide-details
                          persistent-hint
                          class="stable-select"
                        />
                      </div>

                      <!-- Total Details RIGHT -->
                      <div class="text-right">
                        <h4>Total New Gallon Add-on: ₱{{ totalNewGallon }}.00</h4>
                        <h4 class="discount-text">Total Discount: -₱{{ totalDiscount }}.00</h4>
                        <h3>
                          <b>Total All Orders: ₱{{ finalTotal }}.00</b>
                        </h3>
                      </div>
                    </div>
                  </div>
                </v-container>

                <v-container v-for="(order, index) in orders" :key="index" ref="orderRefs">
                  <v-row class="text-center mx-auto">
                    <v-col cols="12" md="4" class="set-sched-btn">
                      <v-btn variant="none" class="full-btn" @click="showCalendar = !showCalendar">
                        <div>
                          <h3 class="set"><v-icon>mdi-calendar</v-icon> Set a delivery</h3>
                          <h3>schedule</h3>
                        </div>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="4" class="bulk-btn">
                      <v-btn variant="none" class="full-btn" @click="orderInBulk">
                        <div>
                          <h5>Order in bulk</h5>
                          <h3>Save ₱10.00</h3>
                        </div>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="4" class="order-bottom-btn">
                      <v-btn variant="none" class="full-btn" @click="placeOrder">
                        <div>
                          <h5>Order now</h5>
                          <h3>₱20 | each</h3>
                        </div>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>

              <!--end Right Column-->
            </v-row>
          </v-container>
        </template>
      </StationLayout>
      <!--End Card Station Area-->
    </template>
  </NavigationBar>

  <!-- Success Dialog for Completed Orders -->
  <v-dialog v-model="showSuccessDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Order Successful</v-card-title>
      <v-card-text>{{ successMessage }}</v-card-text>
      <v-card-actions class="justify-center">
        <v-btn class="custom-okay-btn" @click="handleDialogOk"> Okay </v-btn>
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- End Success Dialog -->

  <!-- Incomplete Order Dialog -->
  <v-dialog v-model="showIncompleteOrderDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Incomplete Order</v-card-title>
      <v-card-text>{{ incompleteOrderMessage }}</v-card-text>
      <v-card-actions class="justify-center">
        <v-btn class="custom-okay-btn" @click="handleIncompleteOrderOk"> Okay </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- End Incomplete Order Dialog -->
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase' // ✅ import Supabase
import StationLayout from '@/components/layout/StationLayout.vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import { useOrderStore } from '@/stores/orders'
import '@/assets/main.css'

const router = useRouter()
const orderRefs = ref([])
const orderStore = useOrderStore()

// Calendar and Reviews
const showCalendar = ref(false)
const selectedDate = ref(null)

const newReview = ref({
  rating: 0,
  comment: '',
})

function confirmDateSelection() {
  showCalendar.value = false
}

function submitReview() {
  if (newReview.value.comment && newReview.value.rating) {
    reviews.value.push({ ...newReview.value })
    newReview.value.rating = 0
    newReview.value.comment = ''
  }
}

// Address items
const items = ['Guingona Subdivision', 'JP Rizal St.', 'Montilla Blvd']

// Orders and Totals
const orders = ref([{ selected: [], address: '', quantity: 0 }])
const ordersContainer = ref(null)
const totalDiscount = ref(0)
const totalNewGallon = ref(0)
const finalTotal = ref(0)
const showSuccessDialog = ref(false)
const successMessage = ref('Your order has been placed successfully!')
const showIncompleteOrderDialog = ref(false)
const incompleteOrderMessage = ref('Please complete your order before placing it.')
const paymentMethod = ref('Cash on Delivery')

const station = ref({
  name: 'Aquabon Water Refilling Station',
})

function getSubtotal(order) {
  const base = order.quantity * 25
  const hasNewGallon = order.selected.includes('Buy with New Gallon (₱100)')
  const addon = hasNewGallon ? order.quantity * 100 : 0
  return base + addon
}

function getDiscount(order) {
  return order.quantity >= 12 ? 10 : 0
}

function updateTotals() {
  let subtotal = 0
  let discount = 0
  let newGallonTotal = 0

  orders.value.forEach((order) => {
    const hasNewGallon = order.selected.includes('Buy with New Gallon (₱100)')
    subtotal += getSubtotal(order)
    discount += getDiscount(order)
    if (hasNewGallon) {
      newGallonTotal += order.quantity * 100
    }
  })

  totalNewGallon.value = newGallonTotal
  totalDiscount.value = discount
  finalTotal.value = subtotal - discount
}

function increaseGallon(index) {
  orders.value[index].quantity++
  updateTotals()
}

function decreaseGallon(index) {
  if (orders.value[index].quantity > 0) {
    orders.value[index].quantity--
    updateTotals()
  }
}

import { nextTick } from 'vue'

function addNewOrder() {
  orders.value.push({ selected: [], address: '', quantity: 0 })
  nextTick(() => {
    const lastIndex = orders.value.length - 1
    const lastOrderEl = orderRefs.value[lastIndex]
    if (lastOrderEl?.$el) {
      lastOrderEl.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

function orderInBulk() {
  orders.value.forEach((order) => {
    order.quantity += 12
  })
  updateTotals()
}

function handleOptionChange() {
  updateTotals()
}

updateTotals()

function cancelOrder(index) {
  orders.value.splice(index, 1)
  updateTotals()
}

async function getUserId() {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Cannot get user:', error)
    return null
  }
  return data.user?.id || null
}

async function placeOrder() {
  const isValidOrder = orders.value.some(
    (order) => order.quantity > 0 && order.selected.length > 0 && order.address !== '',
  )

  if (!isValidOrder) {
    incompleteOrderMessage.value = 'Please complete your order before placing it.'
    showIncompleteOrderDialog.value = true
    return
  }

  const userId = await getUserId()

  if (!userId) {
    successMessage.value = 'Please login first before placing an order.'
    showSuccessDialog.value = true
    return
  }

  // Generate random ID for each order placed
  const randomId = Math.floor(Math.random() * 1000000) // Example random id

  // Insert the order into the database
  const orderToSave = orders.value.map((order) => ({
    id: randomId, // Include random ID
    address: order.address,
    quantity: order.quantity,
    total_price: getSubtotal(order),
    status: 'To Deliver',
    user_id: userId,
    created_at: new Date().toISOString(),
    calendar: selectedDate.value || new Date().toISOString().substr(0, 10),
    payment_method: paymentMethod.value,
    station_name: station.value.name,
  }))

  const { data, error } = await supabase.from('orders').insert(orderToSave)

  if (error) {
    console.error('Error placing order:', error)
    successMessage.value = 'Failed to place order: ' + error.message
    showSuccessDialog.value = true
  } else {
    successMessage.value = 'Your order has been placed successfully!'
    showSuccessDialog.value = true

    // Clear the order form
    orders.value = [{ selected: [], address: '', quantity: 0 }]
    updateTotals()
  }
}

function handleDialogOk() {
  showSuccessDialog.value = false
  // Reset the order form
  orders.value = [{ selected: [], address: '', quantity: 0 }]
  updateTotals()

  // Navigate to the next page (e.g., /order page)
  router.push('/order')
}

function handleIncompleteOrderOk() {
  showIncompleteOrderDialog.value = false
}

import { computed, onMounted } from 'vue'
import { useReviewStore } from '@/stores/reviewStore'

const reviewStore = useReviewStore()

const stationId = 'station-123' // Should be dynamic (from route param maybe)
const reviews = computed(() => reviewStore.getReviewsByStation(stationId))

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0)
  return (total / reviews.value.length).toFixed(1)
})

const actualReviews = ref([])

// Fetch reviews from the store or Supabase
async function fetchReviews() {
  // First, load reviews from localStorage if they exist
  reviewStore.loadReviewsFromLocalStorage(stationId)

  // If no reviews in localStorage, check in the review store
  if (reviews.value.length === 0) {
    const storeReviews = reviewStore.getReviewsByStation(stationId)
    if (storeReviews.length > 0) {
      actualReviews.value = storeReviews
    } else {
      // If not in store, fetch from Supabase
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false }) // Newest reviews first

      if (error) {
        console.error('Error fetching reviews:', error)
      } else {
        actualReviews.value = data
        // Save the fetched reviews into the store and localStorage
        reviewStore.saveReviewsToLocalStorage(stationId)
        reviewStore.setReviewsByStation(stationId, data)
      }
    }
  }
}

async function submitActualReview(orderId) {
  const userId = await getUserId()

  if (!userId) {
    console.error('User not logged in')
    return
  }

  if (newReview.value.comment && newReview.value.rating) {
    const { error } = await supabase.from('reviews').insert({
      rating: newReview.value.rating,
      comment: newReview.value.comment,
      created_at: new Date().toISOString(),
      order_id: orderId,
      user_id: userId,
    })
    if (error) {
      console.error('Error submitting review:', error)
    } else {
      // Create the new review data
      const newReviewData = {
        rating: newReview.value.rating,
        comment: newReview.value.comment,
        created_at: new Date().toISOString(),
        order_id: orderId,
        user_id: userId,
      }

      // Add the new review to the start of the list
      actualReviews.value.unshift(newReviewData) // Add to top

      // Reset the new review form
      newReview.value.rating = 0
      newReview.value.comment = ''

      // Also save the new review to the store and localStorage
      reviewStore.addReview(stationId, newReviewData, user) // Assuming `user` is defined
      reviewStore.saveReviewsToLocalStorage(stationId) // Save after adding review
    }
  }
}

// Fetch reviews on page load
onMounted(() => {
  fetchReviews()
})
</script>

<style scoped>
.v-divider {
  background-color: #000;
  color: #1c238b;
}

.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.review-style {
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 20px;
  font-weight: 600;
}
.profile-name-style {
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 16px;
  font-weight: 500;
}
.profile-email-style {
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 13px;
  font-weight: 400;
  padding-top: 0%;
  margin-top: -0.5rem;
}
.review-card {
  border: #0557b6 1px solid;
  background-color: #dee8ef;
}
.review-comment {
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 13px;
  margin-top: -0.5rem;
}

.discount-text {
  color: red;
}

.scrollable-content {
  max-height: 470px;
  overflow-y: auto;
  padding-right: 8px;
}

.stable-select {
  width: 200px; /* enough for longest option */
  height: 42px !important;
}

.stable-select .v-input__control {
  height: 42px !important;
  min-height: 42px !important;
}

.stable-select .v-field__input {
  height: 42px !important;
  line-height: 42px !important;
  font-size: 14px !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.custom-calendar {
  background-color: #2e2545;
  color: white;

  border-radius: 12px;

  padding: 1rem;
}

.custom-calendar .v-date-picker-header {
  background-color: #2e2545;
}

/* Optional: tweak day cells */
.custom-calendar .v-btn {
  color: white; /* Make calendar day numbers white */
}

.modal-content {
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  max-height: 30vh;
  overflow-y: auto;
}
.modal-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.custom-okay-btn {
  background-color: #02adef;
  color: white;
}

.custom-okay-btn:hover {
  background-color: #0296d1;
}
</style>
