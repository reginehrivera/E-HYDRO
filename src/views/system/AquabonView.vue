<template>
  <NavigationBar>
    <template #content>
      <StationLayout>
        <template #dashboardcontent>
          <v-container class="station-container" elevation="24">
            <!-- Top Info -->
            <v-row class="top-style">
              <v-col cols="6">
                <h2>Aquabon Water Refilling Station</h2>
              </v-col>
              <v-col cols="6" class="text-end">
                <router-link to="/station" class="no-underline">
                  <v-icon class="close">mdi-window-close</v-icon>
                </router-link>
              </v-col>
            </v-row>

            <v-row>
              <!-- Left Column -->
              <v-col cols="12" md="5">
                <!-- Image and Description -->
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
                  <v-container class="description-card">
                    <v-row class="description-row">
                      <v-col cols="12" md="7" class="description shrink-line">
                        <p class="shrink-line">
                          <v-icon class="blue-color">mdi-map-marker</v-icon>
                          177 Cancer St. Montilla Blvd Highway, Guingona Subdivision Brgy JP Rizal,
                          Butuan City, Philippines
                        </p>
                      </v-col>
                      <v-col cols="12" md="5" class="description text-end shrink-line">
                        <h3 class="blue-color"><b>₱25.00</b></h3>
                        <p4 class="blue-color">per gallon</p4><br />
                        <span>No Delivery Fee</span>
                      </v-col>
                    </v-row>
                  </v-container>

                  <!-- Contact Buttons -->
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
                </v-container>
              </v-col>

              <!-- Right Column -->
              <v-col cols="12" md="7" class="d-flex flex-column align-start">
                <v-date-picker
                  v-if="showCalendar"
                  v-model="selectedDate"
                  :min="new Date().toISOString().substr(0, 10)"
                  show-adjacent-months
                  color="primary"
                >
                  <!-- Add Cancel and Confirm buttons here -->
                  <template #actions>
                    <v-btn @click="showCalendar = false" color="red" text>Cancel</v-btn>
                    <v-btn @click="confirmDateSelection" color="green" text>Confirm</v-btn>
                  </template>
                </v-date-picker>

                <v-container class="right-container">
                  <!-- Order Options -->
                  <v-row class="first-row">
                    <v-col cols="6" class="grp-checkbox">
                      <h4 class="blue-color">Order Option</h4>
                      <div class="checkboxes">
                        <v-checkbox
                          v-model="selected"
                          label="Refill Only"
                          value="Refill Only"
                          color="primary"
                          class="checkbox-top"
                        />
                        <v-checkbox
                          v-model="selected"
                          label="Buy with New Gallon"
                          value="Buy with New Gallon"
                          color="primary"
                          class="checkbox-bottom"
                        />
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <h4 class="blue-color mb-3">Delivery Address Option</h4>
                      <v-select :items="items" label="Select Address..." />
                    </v-col>
                  </v-row>

                  <v-divider></v-divider>

                  <!-- Order Detail -->
                  <v-row class="second-row">
                    <v-col cols="12" md="2" sm="2">
                      <v-card class="text-center card-img" width="95">
                        <img src="@/assets/img/gallon-aquabon.png" />
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="10" sm="10" class="pl-6">
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
                                @click="toggleDecrease"
                              >
                                <v-icon>mdi-minus</v-icon>
                              </v-btn>
                              <p class="text-h6 text-center">{{ numberOfGallon }}</p>
                              <v-btn
                                rounded="0"
                                class="btn-plus"
                                variant="plain"
                                size="small"
                                @click="toggleIncrease"
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

                  <!-- Place Another Order -->
                  <div class="text-center">
                    <v-btn rounded="0" class="add-address-btn mt-4 mb-4">
                      <v-icon class="pr-3 text-center text-primary" size="large"
                        >mdi-plus-circle-outline</v-icon
                      >
                      <span class="text-dark">Place a new order for another location</span>
                    </v-btn>
                  </div>

                  <!-- Total Summary -->
                  <div class="total-right mb-3">
                    <p>Subtotal: ₱{{ subtotal }}.00</p>
                    <p v-if="isBulkOrder" class="discount-text">Discount: -₱{{ discount }}.00</p>
                    <h4>Total: ₱{{ totalPriceWithDiscount }}.00</h4>
                  </div>

                  <!-- Bottom Buttons -->
                  <v-row class="cancel-order-btns">
                    <v-col cols="12" md="6" class="text-start">
                      <v-btn variant="none" class="cancel-btn">Cancel</v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                      <router-link class="no-underline" to="/summary">
                        <v-btn variant="none" class="order-btn">Order Now</v-btn>
                      </router-link>
                    </v-col>
                  </v-row>
                </v-container>

                <!-- Action Buttons -->
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
                      <router-link class="no-underline" to="/summary">
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
            </v-row>
          </v-container>
        </template>
      </StationLayout>
    </template>
  </NavigationBar>
</template>

<script setup>
import StationLayout from '@/components/layout/StationLayout.vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import { ref, computed } from 'vue'

const selected = ref([''])
const items = ['Carmen, Butuan City', 'Ampayon, Butuan City']
const showCalendar = ref(false)
const selectedDate = ref(null)
const numberOfGallon = ref(0)
const isBulkOrder = ref(false)

const toggleIncrease = () => {
  if (numberOfGallon.value < 12) {
    numberOfGallon.value++
  }
  if (numberOfGallon.value === 12) {
    isBulkOrder.value = true
  }
}

const toggleDecrease = () => {
  if (numberOfGallon.value > 0) {
    numberOfGallon.value--
    if (numberOfGallon.value < 12) {
      isBulkOrder.value = false
    }
  }
}

const orderInBulk = () => {
  numberOfGallon.value = 12
  isBulkOrder.value = true
}

// Subtotal and discount calculations
const subtotal = computed(() => numberOfGallon.value * 25)

const discount = computed(() => {
  return isBulkOrder.value ? 10 : 0
})

const totalPriceWithDiscount = computed(() => subtotal.value - discount.value)

// Method to confirm the selected date
const confirmDateSelection = () => {
  if (selectedDate.value) {
    showCalendar.value = false
    console.log(`Delivery date confirmed: ${selectedDate.value}`)
  }
}
</script>

<style scoped>
.discount-text {
  color: red;
  font-weight: normal;
  font-size: 15px;
}
</style>
