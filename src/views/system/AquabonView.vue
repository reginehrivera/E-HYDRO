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
                      <v-col cols="12" md="7" sm="7" class="description shrink-line">
                        <p class="shrink-line">
                          <v-icon class="blue-color">mdi-map-marker</v-icon>177 Cancer St. Montilla
                          Blvd Highway, Guingona Subdivision Brgy JP Rizal, Butuan City, Philippines
                        </p>
                      </v-col>
                      <v-col cols="12" md="5" sm="5" class="description text-end shrink-line">
                        <h3 class="blue-color"><b>₱25.00</b></h3>
                        <p class="blue-color">per gallon</p>
                        <br />
                        <span>No Delivery Fee</span>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-container class="contact-btn text-center">
                        <v-row>
                          <v-col cols="12" sm="6" class="d-flex justify-center mb-2 mb-sm-0">
                            <a
                                href="https://www.facebook.com/aquaxbone"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="no-underline w-100"
                              >
                                <v-btn
                                  class="social-contact w-100"
                                  rounded="0"
                                  variant="flat"
                                  prepend-icon="mdi-facebook-messenger"
                                >
                                  <span class="text-center">Messenger</span>
                                  <v-tooltip activator="parent" location="bottom">Message Aquabon</v-tooltip>
                                </v-btn>
                              </a>
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
                      <p class="review-style pl-10 pt-2">
                        {{ averageRating }} <v-icon color="yellow darken-2">mdi-star</v-icon> Ratings
                        ({{ actualReviews.length }})
                        <v-tooltip activator="parent" location="right"
                          >Scroll down to view more reviews!</v-tooltip
                        >
                      </p>
                  <v-container id="review-section" class="review-content" >
                    <v-card
                      v-for="(review, index) in actualReviews"
                      :key="index"
                      class="mb-2 pl-1 pr-1 review-card"
                    >
                      <v-card-title class="d-flex align-center pt-2">
                        <button
                          class="expand-btn"
                          style="
                            position: absolute;
                            top: 13px;
                            right: 20px;
                            background: none;
                            border: none;
                            font-size: 15px;
                            cursor: pointer;
                            color: #04448d;
                          "
                          @click="showReviewModal = true"
                        >
                          <v-icon>mdi-arrow-expand</v-icon>
                        </button>
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

                 <!-- Review Modal -->
                  <v-dialog v-model="showReviewModal" max-width="900" class="station-review-modal">
                    <v-card class="station-review-card pb-5">
                      <v-card-title class="text-h6 text-center station-review-title pt-6"><v-icon>mdi-message-draw</v-icon> Customer Reviews</v-card-title>
                      <v-card-text class="review-modal-body">
                        <v-container id="review-section" class="">
                          <v-card
                            v-for="(review, index) in actualReviews"
                            :key="index"
                            class="mb-3 pl-5 pr-5 review-card-modal"
                          >
                            <v-card-title class="d-flex align-center pt-2">
                              <v-row>
                                <v-col cols="12" md="1">
                                  <v-avatar color="deep-purple lighten-3" size="50">
                                    <img
                                      v-if="review.avatar_url"
                                      :src="review.avatar_url"
                                      alt="Avatar"
                                      class="avatar-img"
                                    />
                                    <span v-else class="text-h5">
                                      {{ review.full_name?.charAt(0).toUpperCase() || '?' }}
                                    </span>
                                  </v-avatar>
                                </v-col>
                                <v-col cols="12" md="11">
                                  <div>
                                    <p class="profile-name-style-modal">{{ review.full_name }}</p>
                                  </div>
                                  <div class="text-caption">
                                    <p class="profile-email-style-modal">{{ review.email }}</p>
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
                            <v-card-text>
                              <p class="comment-modal pl-2">{{ review.comment }}</p>
                            </v-card-text>
                          </v-card>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="showReviewModal = false" class="mr-11 mt-4 close-review-btn">Close</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <!--END RATING AND COMMENT--->
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
                    <v-btn
                      @click="confirmDateSelection"
                      color="green"
                      text
                      >Confirm</v-btn
                    >
                  </template>
                </v-date-picker>

                <span v-if="showDateInput" class="delivery-date">
                  <v-icon color="green" size="20" style="top: -2px">mdi-check-circle</v-icon>
                  Your delivery is set for <span class="blue-text">{{ formattedDate }}</span
                  >.<br />
                  Please provide the other details to proceed.
                </span>

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
                          <h4 class="blue-color" id="station-right-container-content">
                            Order Option
                          </h4>
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
                            <img src="@/assets/img/gallon-aquabon.png" />
                          </v-card>
                        </v-col>
                        <v-col cols="12" md="10" class="pl-6">
                          <v-row>
                            <v-col cols="12" class="pt-3">
                              <h5 class="blue-color pt-0 mt-0">{{ station.name }}</h5>
                              <h6>
                                Location: 177 Cancer St., Montilla Blvd Highway, Brgy JP Rizal
                              </h6>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="12" md="6">
                              <p class="text-h6 pt-0">₱ 25.00 per gallon</p>
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
                    <v-btn variant="none" class="order-btn" @click="placeOrder"
                      >Place Order
                      <v-tooltip activator="parent" location="left"
                        >Click to confirm order
                      </v-tooltip></v-btn
                    >
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
                        @click="toggleCalendar"
                      >
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
                        @click="placeOrderButton"
                      >
                        <div>
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
        <router-link to="/station" class="pl-7 text-start">
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
const showReviewModal = ref(false)
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

// Calendar and Reviews
const showCalendar = ref(false)
const selectedDate = ref(null)
const ordersContainer = ref(null)
//const orderRefs = ref([])

const userAddresses = ref([])
const isLoadingAddresses = ref(false)
const hasNoAddresses = ref(false)
const showDateInput = ref(false)
const formattedDate = ref('')
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
  name: 'Aquabon Water Refilling Station',
})

function confirmDateSelection() {
  console.log('Confirming date:', selectedDate.value) // Debug log
  if (selectedDate.value) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    formattedDate.value = new Date(selectedDate.value).toLocaleDateString('en-US', options)
    showDateInput.value = true
    showCalendar.value = false
    console.log('Date confirmed:', formattedDate.value) // Debug log
  } else {
    console.warn('No date selected!') // Debug log
  }
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
    calendar: selectedDate.value
      ? `${selectedDate.value.getFullYear()}-${String(selectedDate.value.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.value.getDate()).padStart(2, '0')}`
      : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
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

const reviewStore = useReviewStore()

//const stationId = 'station-123' // Should be dynamic (from route param maybe)
//const reviews = computed(() => reviewStore.getReviewsByStation(stationId))

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
const clickedButton = ref('') // For tracking which button was clicked

function toggleCalendar() {
  showCalendar.value = true
  clickedButton.value = 'calendar'
}

function placeOrderButton() {
  showCalendar.value = false
  clickedButton.value = 'order'
}
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

.review-comment {
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 13px;
  margin-top: -0.5rem;
}
.scrollable-content {
  max-height: 420px;
  overflow-y: auto;
  padding-right: 8px;
}

.text-right h4,
h3 {
  font-family: 'Inter', Times, serif;
}
.text-right h4 {
  font-size: 15px;
}
.text-right h3 {
  font-size: 18px;
}
.discount-text {
  color: red;
  font-size: 15px;
}

/*--------------Calendar Style ------------*/
.custom-calendar {
  background-color: #dee8efc2;
  color: #000;
  border-radius: 12px;
  border: 3px solid #0557b6;
  padding: 1rem;
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 17px !important;
}

/*.custom-calendar .v-date-picker-header {
  background-color: #2e2545 !important;
}*/

/* Optional: tweak day cells */
.custom-calendar .v-btn {
  border-radius: 15px;
}

.avatar-img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.address-empty-state {
  border: 1px dashed rgba(0, 0, 0, 0.2);
  background-color: rgba(250, 250, 250, 0.5);
}

.v-select :deep(.v-field__append-inner) {
  padding-top: 8px;
}

.v-select :deep(.v-select__selection) {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.blue-text {
  color: blue;
}
.delivery-date {
  max-width: 600px;
  width: 100%; /* Make the container take full width */
  text-align: center;
  background-color: #dee8ef; /* Background color */
  border: 2px solid #0557b6; /* Full border */
  border-radius: 12px;
  color: #333;
  padding: 16px; /* Space inside the box */
  margin: 16px 0;
  margin: 1rem auto;
  font-weight: 500;
}

@media (max-width: 1288px) {
  .delivery-date {
    font-size: 0.875rem; /* slightly smaller text */
    padding: 0.75rem;
    width: 450px;
  }
}
@media (max-width: 950px) {
  .delivery-date {
    font-size: 0.875rem; /* slightly smaller text */

    width: 100%;
  }
}
@media (max-width: 700px) {
  .delivery-date {
    font-size: 0.875rem; /* slightly smaller text */
    padding: 0.75rem;
    width: 90%;
  }
}
/* Animation for empty state */
@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.v-progress-circular {
  animation: pulse 2s infinite ease-in-out;
}

.clicked-btn {
  color: white !important;
}

/**Bottom Btn Colored when hover or clicked MAIN CSS*/
.full-btn {
  transition:
    background-color 0.3s,
    color 0.3s;
}

/* Hover effect */
.full-btn:hover {
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  color: white;
  h3 {
    color: white;
  }
  h5 {
    color: white;
  }
}

/* Clicked (active) effect */
.clicked-btn {
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  transition: background-position 0.5s ease;
  h3 {
    color: white;
  }
  h5 {
    color: white;
  }
}
.order-btn {
  text-transform: none;
  font-family: 'Inter' sans-serif;
  font-weight: 600;
  background: #0557b6;
  background-size: 200% auto;
  background-position: left center;
  color: white;
  border-radius: 20px;
  text-transform: none;
  transition: background-position 0.5s ease;
  margin-right: 0.2rem;
}
.order-btn:hover {
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  color: white;
}

/**========Modal Style============ */
.modal-message-style {
  border-radius: 20px !important;
  padding: 10px;
  font-family: 'Familjen Grotesk', Times, serif;
}
.success-style {
  color: #0557b6;
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 20px;
  font-weight: 600;
}
.custom-okay-btn {
  background-color: #02adef;
  color: white;
  text-transform: none;
}
.custom-exit-btn {
  text-transform: none;
  border: 1px solid #02adef;
  color: #02adef;
}

.custom-okay-btn:hover {
  background-color: #0296d1;
}
.modal-message-style .incomplete-style {
  color: red;
}
.custom-incomplete-btn {
  border: 1px solid #02adef !important;
  color: #02adef;
  text-transform: none;
}

/**===========STATION REVIEW MODAL STYLE======== */
.expand-btn {
  border-radius: 5px;
  padding: 3px !important;
  width: 11% !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.651);
  transition: transform 0.3s ease, background-position 0.3s ease;
}
.expand-btn:hover {
  background-color: #0296d1c9 !important;
  color: rgba(255, 255, 255, 0.774) !important;
  transform: scale(1.1);
  box-shadow: none;
}
.station-review-modal{
  background-color: #00000096;
}
.station-review-card{
  background-color: #dee8ef !important;
  border-radius: 10px !important;
}
.review-modal-body {
  max-height: 100vh;
  overflow-y: auto;
}
.review-card-modal {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.644);
}
.station-review-title {
  margin-bottom: 8px;
  font-family: 'Inter', Courier, monospace;
  color: #04448d;
}
.profile-name-style-modal, .profile-email-style-modal{
  font-family: 'Familjen Grotesk', Courier, monospace;
  color: #04448d;
}
.comment-modal{
  font-size: 15px;
  font-family: 'Inter', Courier, monospace;
  font-weight: 500;
}
.close-review-btn{
  text-transform: none;
  background-color: #0296d1;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', Courier, monospace;
  width: 10%;
}
.close-review-btn:hover{
  background-color: #0557b6;
}

</style>
