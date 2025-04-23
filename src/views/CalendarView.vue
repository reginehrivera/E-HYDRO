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

            <!-- Left Column -->
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

                  <!-- Description -->
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
              <v-col cols="12" md="7">
                <v-container class="right-container">
                  <v-row class="first-row">
                    <v-col cols="6" class="grp-checkbox">
                      <h4 class="blue-color">Order Option</h4>
                      <div class="checkboxes">
                        <div class="checkbox-one">
                          <v-checkbox
                            v-model="selected"
                            label="Refill Only"
                            value="Refill Only"
                            color="primary"
                            class="checkbox-top"
                          ></v-checkbox>
                        </div>
                        <div class="checkbox-two">
                          <v-checkbox
                            v-model="selected"
                            label="Buy with New Gallon"
                            value="Buy with New Gallon"
                            color="primary"
                            class="checkbox-bottom"
                          ></v-checkbox>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <h4 class="blue-color mb-3">Delivery Address Option</h4>
                      <v-select :items="items" label="Select Address..."></v-select>
                    </v-col>
                  </v-row>

                  <v-divider></v-divider>

                  <div class="text-center">
                    <v-btn rounded="0" class="add-address-btn mt-4 mb-4">
                      <v-icon class="pr-3 text-center text-primary" size="large">
                        mdi-plus-circle-outline
                      </v-icon>
                      <span class="text-dark">Place a new order for another location</span>
                    </v-btn>
                  </div>

                  <!-- Total -->
                  <div class="total-right mb-3">
                    <p>Subtotal: ₱{{ subtotal }}.00</p>
                    <p v-if="isBulkOrder" class="discount-text">Discount: -₱{{ discount }}.00</p>
                    <h4>Total: ₱{{ totalPriceWithDiscount }}.00</h4>
                  </div>

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

                <!-- 📅 Set Schedule Button -->
                <v-container>
                  <v-row class="text-center mx-auto">
                    <v-col cols="12" md="4" sm="4" xs="4" class="set-sched-btn">
                      <v-btn @click="showCalendar = true" variant="none" class="full-btn">
                        <div>
                          <h3 class="set"><v-icon>mdi-calendar</v-icon> Set a delivery</h3>
                          <h3>schedule</h3>
                        </div>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>

                <!-- 🗓️ Calendar Modal -->
                <v-dialog v-model="showCalendar" max-width="500px">
                  <v-card>
                    <v-card-title class="headline">Select Delivery Date</v-card-title>
                    <v-card-text>
                      <v-calendar
                        v-model="deliveryDate"
                        :events="calendarEvents"
                        event-color="purple"
                        event-text-color="white"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-btn text @click="showCalendar = false">Close</v-btn>
                      <v-btn color="primary" @click="setSchedule">Set Schedule</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </StationLayout>
    </template>
  </NavigationBar>
</template>

<script setup>
import { ref, computed } from 'vue'
import StationLayout from '@/components/layout/StationLayout.vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import 'v-calendar/style.css'

const showCalendar = ref(false)
const deliveryDate = ref(null)
const calendarEvents = ref([])

const setSchedule = () => {
  console.log('Delivery date set for:', deliveryDate.value)
  showCalendar.value = false
}

const selected = ref([''])
const items = ['']

const numberOfGallon = ref(0)
const isBulkOrder = ref(false)

const toggleIncrease = () => {
  numberOfGallon.value++
  isBulkOrder.value = numberOfGallon.value >= 12
}

const toggleDecrease = () => {
  if (numberOfGallon.value > 0) {
    numberOfGallon.value--
    isBulkOrder.value = numberOfGallon.value >= 12
  }
}

const orderInBulk = () => {
  numberOfGallon.value = 12
  isBulkOrder.value = true
}

const pricePerGallon = 20
const subtotal = computed(() => numberOfGallon.value * pricePerGallon)
const discount = computed(() => (isBulkOrder.value ? 10 : 0))
const totalPriceWithDiscount = computed(() => subtotal.value - discount.value)
</script>

<style scoped>
.discount-text {
  color: red;
  font-weight: normal;
  font-size: 15px;
}
</style>
