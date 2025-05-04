<template>
  <NavigationBar>
    <template #content>
      <StationLayout>
        <template #dashboardcontent>
          <!--Card Station Area-->
          <v-container class="station-container" elevation="24">
            <v-row class="top-style">
              <v-col cols="6">
                <h2>{{ station.name }}  <v-icon class="cart-run">mdi-store-marker</v-icon></h2>
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
                        src="@/assets/img/coldpoint-img.jpg"
                        height="250"
                        width="380"
                        class="responsive-img mx-auto"
                        alt="Coldpoint image"
                      />
                    </v-col>
                  </v-row>
                  <v-container class="contact-btn text-center mt-4">
                        <v-row>
                          <v-col cols="12" sm="6" class="d-flex justify-center ">
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
                                  >0920 974 6133</v-tooltip
                                >
                              </v-btn>
                            </router-link>
                          </v-col>
                        </v-row>
                      </v-container>
                  <!--Description-->
                  <v-container class="description-card">
                    <v-row class="description-row">
                      <v-col cols="12" md="7" sm="7" class="description shrink-line">
                        <p class="shrink-line">
                          <v-icon class="blue-color">mdi-map-marker</v-icon>P-6, Villa Kananga, Butuan City, Philippines
                        </p>
                      </v-col>
                      <v-col cols="12" md="5" sm="5" class="description text-end shrink-line">
                        <h3 class="blue-color"><b>₱20.00</b></h3>
                        <p class="blue-color">per gallon</p><br />
                        <span>For Delivery/</span><br>
                        <span>Pick-up Call</span>
                      </v-col>
                    </v-row>
                  </v-container>


                  <v-divider :thickness="2"></v-divider>
                  <!---RATING AND COMMENTS WILL REFLECT THIS AREA-->
                  <p class="review-style pl-8 pt-2">
                    {{ averageRating }} <v-icon color="yellow darken-2">mdi-star</v-icon> Ratings
                    ({{ actualReviews.length }})
                    <v-tooltip activator="parent" location="right"
                      >Scroll down to view more reviews!</v-tooltip
                    >
                  </p>
                  <v-container id="review-section" class="modal-content">
                    <v-card
                      v-for="(review, index) in actualReviews"
                      :key="index"
                      class="mb-1 pl-5 pr-5 review-card"
                    >
                      <v-card-title class="d-flex align-center pt-2">
                        <v-row>
                          <v-col cols="12" md="2" class="">
                            <v-avatar color="deep-purple lighten-3" size="50">
                              <img
                                v-if="review.avatar_url"
                                :src="review.avatar_url"
                                alt="Avatar"
                                class="avatar-img"
                              />
                              <span v-else class="text-h5">{{
                                review.full_name?.charAt(0).toUpperCase() || '?'
                              }}</span>
                            </v-avatar>
                          </v-col>
                          <v-col cols="12" md="10">
                            <div>
                              <p class="profile-name-style">{{ review.full_name }}</p>
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
                  color="green"
                  :selected-color="'#2e2545'"
                  >+
                  <template #actions>
                    <v-btn @click="showCalendar = false" color="red" text>Cancel</v-btn>
                    <v-btn @click="confirmDateSelection" href="#station-right-container-content" color="green" text>Confirm</v-btn>
                  </template>
                </v-date-picker>
                <!-- Updated template section with fixes for order card stability -->
                <!-- Add data-order-index attributes to order containers -->
                <v-container class="right-container" ref="ordersContainer">
                  <div class="scrollable-content">
                    <v-container
                      v-for="(order, index) in orders"
                      :key="index"
                      :data-order-index="index"
                      class="order-card"
                    >
                      <v-row class="first-row">
                        <v-col cols="6" class="grp-checkbox">
                          <h4 class="blue-color" id="station-right-container-content">Order Option</h4>
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
                          <div v-if="isLoadingAddresses">
                            <v-progress-circular
                              indeterminate
                              color="primary"
                              size="24"
                              class="mr-2"
                            ></v-progress-circular>
                            <span>Loading addresses...</span>
                          </div>
                          <div v-else-if="userAddresses.length > 0">
                            <v-select
                              v-model="order.address"
                              :items="userAddresses"
                              label="Select Address..."
                              item-title="title"
                              item-value="value"
                              variant="outlined"
                              density="comfortable"
                              :error-messages="order.address ? [] : ['Please select an address']"
                            >
                              <template v-slot:append-item>
                                <v-divider class="mb-2"></v-divider>
                                <v-list-item
                                  @click="goToAddressPage"
                                  class="text-primary"
                                  title="Manage Addresses"
                                  prepend-icon="mdi-plus-circle"
                                ></v-list-item>
                              </template>
                            </v-select>
                          </div>
                          <div v-else class="address-empty-state pa-4 rounded">
                            <div class="text-center mb-3">
                              <v-icon color="grey" size="36">mdi-map-marker-off</v-icon>
                              <p class="text-body-1 mt-2">No addresses found</p>
                              <p class="text-caption text-grey">
                                Please add a delivery address to continue
                              </p>
                            </div>
                            <v-btn
                              color="primary"
                              variant="outlined"
                              block
                              @click="goToAddressPage"
                              class="mt-2"
                            >
                              <v-icon left class="mr-1">mdi-plus</v-icon>
                              Add New Address
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>

                      <v-divider></v-divider>

                      <v-row class="second-row">
                        <v-col cols="12" md="2">
                          <v-card class="text-center card-img" width="95">
                            <img src="@/assets/img/gallon-coldpoint.png" />
                          </v-card>
                        </v-col>
                        <v-col cols="12" md="10" class="pl-6">
                          <v-row>
                            <v-col cols="12" class="pt-3">
                              <h5 class="blue-color pt-0 mt-0">{{ station.name }}</h5>
                              <h6>
                                Location: Baladad Comp., Libertad, Butuan City
                              </h6>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" md="6">
                              <p class="text-h6 pt-0">₱ 20.00 per gallon</p>
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
                              <p class="subtotal-style">Subtotal: ₱{{ getSubtotal(order) }}.00</p>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>

                      <v-divider></v-divider>

                      <div class="total-right mb-3">
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

                    <!-- "Add new order" button moved outside the order loop -->
                    <div class="text-center">
                      <v-btn rounded="0" class="add-address-btn pt-0 mb-4" @click="addNewOrder">
                        <v-icon class="pr-3 text-center text-primary" size="large">
                          mdi-plus-circle-outline
                        </v-icon>
                        <span class="text-dark">Place a new order for another location</span>
                      </v-btn>
                    </div>
                  </div>

                  <div class="text-end">
                    <v-divider class="my-4"></v-divider>

                    <div class="d-flex justify-space-between align-start mb-3 ml-2 mr-2">
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

                  <div col="12" md="6" class="text-end">
                      <v-btn variant="none" class="order-btn" @click="placeOrder">Place Order <v-tooltip activator="parent" location="left">Click to confirm order </v-tooltip></v-btn>
                    </div>
                </v-container>

                <!-- Fixed Bottom Action Buttons - This is always shown at the bottom -->
                <v-container class="fixed-bottom-buttons">
                  <v-row class="text-center mx-auto">
                    <v-col cols="12" md="6" sm="6" xs="6" class="set-sched-btn">
                      <v-btn
                        variant="none"
                        class="full-btn"
                        :class="{ 'clicked-btn': clickedButton === 'calendar' }"
                        @click="toggleCalendar">
                        <div>
                          <h3 class="set"><v-icon>mdi-calendar</v-icon> Set a delivery</h3>
                          <h3>schedule</h3>
                        </div>
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="6" sm="6" xs="6" class="order-bottom-btn">
                      <v-btn
                        variant="none"
                        class="full-btn"
                        :class="{ 'clicked-btn': clickedButton === 'order' }"
                        @click="placeOrderButton">
                        <div >
                          <h5>Deliver Water Now</h5>
                          <h3>₱20 per gallon</h3>
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
    <v-card class="modal-message-style">
      <v-card-title class="text-h6 success-style">Order Successful</v-card-title>
      <v-card-text class="">{{ successMessage }}</v-card-text>
      <v-card-actions class="">
        <router-link to="/station" class=" pl-7 text-start">
          <v-btn class="custom-exit-btn"> Exit </v-btn>
        </router-link>
        <v-btn class="custom-okay-btn text-end" @click="handleDialogOk"> Check Orders </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- End Success Dialog -->

  <!-- Incomplete Order Dialog -->
  <v-dialog v-model="showIncompleteOrderDialog" max-width="400">
    <v-card class="modal-message-style">
      <v-card-title class="text-h6 incomplete-style">Incomplete Order</v-card-title>
      <v-card-text>{{ incompleteOrderMessage }}</v-card-text>
      <v-card-actions class="justify-end pr-7">
        <v-btn class="custom-incomplete-btn" @click="handleIncompleteOrderOk"> Okay </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- End Incomplete Order Dialog -->
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import StationLayout from '@/components/layout/StationLayout.vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'
//import { useOrderStore } from '@/stores/orders'
import '@/assets/main.css'
import { useUserStore } from '@/stores/user'
import { useReviewStore } from '@/stores/reviewStore'

const router = useRouter()
//const orderStore = useOrderStore()
const userStore = useUserStore()
const reviewStore = useReviewStore()

// Calendar and Reviews
const showCalendar = ref(false)
const selectedDate = ref(null)
const ordersContainer = ref(null)
//const orderRefs = ref([])

const userAddresses = ref([])
const isLoadingAddresses = ref(false)
const hasNoAddresses = ref(false)

const submissions = ref([]) // Placeholder for existing submissions data
// Function to fetch user addresses from Supabase
async function fetchUserAddresses() {
  isLoadingAddresses.value = true
  hasNoAddresses.value = false

  try {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      console.error('No authenticated user found')
      hasNoAddresses.value = true
      return
    }

    // Fetch all addresses for this user from addresses table
    // (we'll use the existing submissions data that's already stored in your system)
    const { data: addressesData, error: addressesError } = await supabase
      .from('addresses')
      .select('id, street_address, barangay, city, formatted_address')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (addressesError) {
      console.error('Error fetching addresses:', addressesError)
      hasNoAddresses.value = true
      return
    }

    console.log('Fetched addresses data:', addressesData) // Debug log

    if (addressesData && addressesData.length > 0) {
      // Map the addresses to format needed for v-select
      userAddresses.value = addressesData.map((addr) => ({
        value: addr.formatted_address || `${addr.street_address}, ${addr.barangay}, ${addr.city}`,
        title: addr.formatted_address || `${addr.street_address}, ${addr.barangay}, ${addr.city}`,
        id: addr.id,
      }))
    } else {
      // Fallback to check if we have submissions in local state already
      if (submissions.value && submissions.value.length > 0) {
        userAddresses.value = submissions.value.map((addr) => ({
          value: `${addr.address}, ${addr.barangay}, ${addr.city}`,
          title: `${addr.address}, ${addr.barangay}, ${addr.city}`,
          id: addr.id,
        }))
      } else {
        // No addresses found for this user
        userAddresses.value = []
        hasNoAddresses.value = true
      }
    }
  } catch (error) {
    console.error('Error in fetchUserAddresses:', error)
    hasNoAddresses.value = true
  } finally {
    isLoadingAddresses.value = false
  }
}

// Function to go to address management page
function goToAddressPage() {
  router.push('/addresses') // Adjust to match your route for the address management page
}

// Call fetchUserAddresses when component mounts
onMounted(() => {
  fetchUserAddresses()
})

// Orders and Totals
const orders = ref([{ selected: [], address: '', quantity: 0 }])
const totalDiscount = ref(0)
const totalNewGallon = ref(0)
const finalTotal = ref(0)
const showSuccessDialog = ref(false)
const successMessage = ref('Your order has been placed successfully!')
const showIncompleteOrderDialog = ref(false)
const incompleteOrderMessage = ref('Please complete your order before placing it.')
const paymentMethod = ref('Cash on Delivery')

const station = ref({
  name: 'Coldpoint Water Refilling Station',
})

function confirmDateSelection() {
  showCalendar.value = true
}

const avatarUrl = ref('')

// Update avatarUrl when user data is available
onMounted(() => {
  if (userStore.profilePhoto) {
    avatarUrl.value = userStore.profilePhoto
  }
  fetchReviews()
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

// Fixed addNewOrder function to prevent card movement
function addNewOrder() {
  // First capture the current scroll position
  const currentScrollPosition = ordersContainer.value?.scrollTop || 0

  // Add the new order
  orders.value.push({ selected: [], address: '', quantity: 0 })

  // Wait for the DOM to update
  nextTick(() => {
    // Restore the scroll position to maintain stability
    if (ordersContainer.value) {
      ordersContainer.value.scrollTop = currentScrollPosition
    }

    // Then smoothly scroll to the new order
    const lastIndex = orders.value.length - 1
    const lastOrderEl = document.querySelector(`[data-order-index="${lastIndex}"]`)
    if (lastOrderEl) {
      lastOrderEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

function handleOptionChange() {
  updateTotals()
}

function cancelOrder(index) {
  // Capture scroll position before removing
  const currentScrollPosition = ordersContainer.value?.scrollTop || 0

  orders.value.splice(index, 1)
  updateTotals()

  // Restore scroll position after DOM updates
  nextTick(() => {
    if (ordersContainer.value) {
      ordersContainer.value.scrollTop = currentScrollPosition
    }
  })
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

  // Insert the order into the database
  const orderToSave = orders.value.map((order) => ({
    address: order.address,
    quantity: order.quantity,
    total_price: getSubtotal(order),
    status: 'To Deliver',
    user_id: userId,
    created_at: new Date().toISOString(),
    calendar: selectedDate.value || new Date().toISOString().substr(0, 10),
    payment_method: paymentMethod.value,
    station_name: station.value.name,
    options: order.selected.join(', '),
  }))

  const { error } = await supabase.from('orders').insert(orderToSave)

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
const averageRating = computed(() => {
  if (actualReviews.value.length === 0) return 0
  const total = actualReviews.value.reduce((sum, review) => sum + review.rating, 0)
  return (total / actualReviews.value.length).toFixed(1)
})

const actualReviews = ref([])

async function fetchReviews() {
  try {
    // Get reviews from feedbacks table
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false }) // Newest first

    if (error) {
      console.error('Error fetching reviews:', error)
      return
    }

    // Create an array to store reviews with user profiles
    const reviewsWithProfiles = []

    // For each feedback, get the corresponding profile
    for (const feedback of data) {
      // Get profile information if user_id exists
      let profileData = { full_name: 'Anonymous', email: '', avatar_url: null }

      if (feedback.user_id) {
        const { data: profileResult, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email, avatar_url')
          .eq('id', feedback.user_id)
          .single()

        if (!profileError && profileResult) {
          profileData = profileResult
        }
      }

      // Add to reviews with combined data
      reviewsWithProfiles.push({
        rating: feedback.rating || 0,
        comment: feedback.comment || '',
        created_at: feedback.created_at,
        full_name: profileData.full_name,
        email: profileData.email || '',
        avatar_url: profileData.avatar_url,
      })
    }

    // Update the actual reviews ref for display
    actualReviews.value = reviewsWithProfiles

    // Also update the reviews in the store if needed
    reviewStore.setReviews(reviewsWithProfiles)
  } catch (e) {
    console.error('Error in fetchReviews:', e)
  }
}

//========Bottom buttton colored when hover and clicked logic====//
const clickedButton = ref(''); // For tracking which button was clicked

function toggleCalendar() {
  showCalendar.value = true;
  clickedButton.value = 'calendar';
}

function placeOrderButton() {
  showCalendar.value = false;
  clickedButton.value = 'order';
}
</script>

<style scope>
.v-divider {
  background-color: #000;
  color: #1c238b;
}

.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
