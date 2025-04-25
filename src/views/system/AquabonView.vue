<template>
  <NavigationBar>
    <template #content>
      <StationLayout>
        <template #dashboardcontent>
          <!--Card Station Area-->
          <v-container class="station-container" elevation="24">
            <v-row class="top-style">
              <v-col cols="6">
                <h2>Aquasis Water Refilling Station</h2>
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

                  <v-divider></v-divider>
                  <!---RATING AND COMMENTS WILL REFLECT THIS AREA-->
                  <v-container>
                    <!-- Review Input -->
                    <v-card class="pa-4 mb-6">
                      <v-card-title>Leave a Review</v-card-title>
                      <v-card-text>
                        <v-rating
                          v-model="newReview.rating"
                          background-color="grey lighten-1"
                          color="yellow darken-2"
                          large
                        />
                        <v-textarea
                          v-model="newReview.comment"
                          label="Your comment"
                          outlined
                          auto-grow
                        />
                        <v-btn color="primary" class="mt-3" @click="submitReview">Submit</v-btn>
                      </v-card-text>
                    </v-card>

                    <!-- Reviews List -->
                    <v-card v-for="(review, index) in reviews" :key="index" class="mb-3">
                      <v-card-title class="d-flex align-center justify-space-between">
                        <v-rating v-model="review.rating" readonly color="yellow darken-2" small />
                      </v-card-title>
                      <v-card-text>{{ review.comment }}</v-card-text>
                    </v-card>
                  </v-container>
                  <!----->
                </v-container>
              </v-col>
              <!--End Left Column-->
              <!--Right Column-->
              <v-col cols="12" md="7" class="d-flex flex-column align-start">
                <v-date-picker
                  v-if="showCalendar"
                  v-model="selectedDate"
                  :min="new Date().toISOString().substr(0, 10)"
                  show-adjacent-months
                  color="primary"
                >
                  <template #actions>
                    <v-btn @click="showCalendar = false" color="red" text>Cancel</v-btn>
                    <v-btn @click="confirmDateSelection" color="green" text>Confirm</v-btn>
                  </template>
                </v-date-picker>

                <v-container class="right-container" v-for="(order, index) in orders" :key="index">
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
                            label="Buy with New Gallon (₱100.00)"
                            value="Buy with New Gallon (₱100.00)"
                            color="primary"
                            class="checkbox-bottom"
                            @change="handleOptionChange"
                          ></v-checkbox>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <h4 class="blue-color mb-3">Delivery Address Option</h4>
                      <v-select v-model="order.address" :items="items" label="Select Address..." />
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
                          <h5 class="blue-color">Aquabon Water Refilling Station</h5>
                          <h6>Location: 177 Cancer St., Montilla Blvd Highway, Brgy JP Rizal</h6>
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

                  <v-row class="cancel-order-btns">
                    <v-col cols="12" md="6" class="text-start">
                      <v-btn variant="none" class="cancel-btn">Cancel</v-btn>
                    </v-col>
                  </v-row>
                </v-container>

                <v-container class="text-end">
                  <v-divider class="my-4"></v-divider>
                  <h4>Total New Gallon Add-on: ₱{{ totalNewGallon }}.00</h4>
                  <h4 class="discount-text">Total Discount: -₱{{ totalDiscount }}.00</h4>
                  <h3>
                    <b>Total All Orders: ₱{{ finalTotal }}.00</b>
                  </h3>
                </v-container>

                <v-container>
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
                      <router-link
                        :to="{
                          name: 'summary',
                          query: { orders: JSON.stringify(orders), schedule: selectedDate },
                        }"
                      >
                        <v-btn variant="none" class="full-btn">
                          <div>
                            <h5>Order now</h5>
                            <h3>₱20 | each</h3>
                          </div>
                        </v-btn>
                      </router-link>
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
</template>

<script setup>
import { ref } from 'vue'
import StationLayout from '@/components/layout/StationLayout.vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'

// Calendar and Reviews
const showCalendar = ref(false)
const selectedDate = ref(null)
const newReview = ref({ rating: 0, comment: '' })
const reviews = ref([])

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

const totalDiscount = ref(0)
const totalNewGallon = ref(0)
const finalTotal = ref(0)

function getSubtotal(order) {
  const base = order.quantity * 25
  const hasNewGallon = order.selected.includes('Buy with New Gallon (₱100.00)')
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
    const hasNewGallon = order.selected.includes('Buy with New Gallon (₱100.00)')
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
  if (orders.value[index].quantity > 1) {
    orders.value[index].quantity--
    updateTotals()
  }
}

function addNewOrder() {
  orders.value.push({ selected: [], address: '', quantity: 0 })
  updateTotals()
}

function orderInBulk() {
  orders.value.forEach((order) => {
    order.quantity += 12
  })
  updateTotals()
}

// Recalculate when options are toggled
function handleOptionChange() {
  updateTotals()
}

// Initial totals
updateTotals()
</script>

<style scoped>
.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.discount-text {
  color: red;
}
</style>
