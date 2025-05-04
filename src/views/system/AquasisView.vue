<template>
  <NavigationBar>
    <template #content>
      <StationLayout>
        <template #dashboardcontent>
          <!--Card Station Area-->
          <v-container class="station-container" elevation="24">
            <v-row class="top-style">
              <v-col col="6">
                <h2>Aquasis Water Refilling Station</h2>
              </v-col>
              <v-col col="6" class="text-end">
                <router-link to="/station" class="no-underline">
                  <v-icon class="close">mdi-window-close</v-icon>
                </router-link>
              </v-col>
            </v-row>
            <!--Left Column-->
            <v-row>
              <v-col col="12" md="5">
                <v-container class="left-container">
                  <v-row class="img-row">
                    <v-col cols="12" class="img-style d-flex">
                      <img
                        src="@/assets/img/aquasis-img.jpg"
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
                      <v-col col="12" md="7" class="description shrink-line">
                        <p class="shrink-line">
                          <v-icon class="blue-color">mdi-map-marker</v-icon>177 Cancer St. Montilla
                          Blvd Highway, Guingona Subdivision Brgy JP Rizal, Butuan City, Philippines
                        </p>
                      </v-col>
                      <v-col col="12" md="5" class="description text-end shrink-line">
                        <h3 class="blue-color"><b>₱25.00</b></h3>
                        <p4 class="blue-color">per gallon</p4><br />
                        <span>No Delivery Fee</span>
                      </v-col>
                    </v-row>
                  </v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-container class="contact-btn text-center">
                        <v-row class="justify-center">
                          <v-col cols="12" sm="6" class="d-flex justify-center mb-2 mb-sm-0">
                            <router-link to="" class="no-underline w-100">
                              <v-btn
                                class="social-contact w-100"
                                rounded="0"
                                variant="flat"
                                prepend-icon="mdi-facebook-messenger"
                              >
                                <span>Messenger</span>
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
                                Contact Number
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
                </v-container>
              </v-col>
              <!--End Left Column-->
              <!--Right Column-->

              <v-col col="12" md="7" class="" v-if="SelectedPage">
                <v-container class="right-container">
                  <v-row class="first-row">
                    <v-col col="6" class="grp-checkbox">
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
                    <v-col col="6">
                      <h4 class="blue-color mb-3">Delivery Address Option</h4>
                      <v-select :items="items" label="Select Address..."></v-select>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-row class="second-row">
                    <v-col col="12" md="2" sm="2"
                      ><!--1st row-->
                      <v-card class="text-center card-img" width="95"
                        ><img src="@/assets/img/gallon-aquasis.png"
                      /></v-card>
                    </v-col>
                    <v-col col="12" md="10" sm="10" class="pl-6"
                      ><!--second row-->
                      <v-row
                        ><!--1st row for 2nd row-->
                        <v-col col="12">
                          <h5 class="blue-color">Aquasis Water Refilling Station</h5>
                          <h6>Location: 177 Cancer St., Montilla Blvd Highway, Brgy JP Rizal</h6>
                        </v-col>
                      </v-row>
                      <v-row
                        ><!--2nd row for 2nd row-->
                        <v-col col="12" md="6" sm="6" xs="12" class="">
                          <p>₱ 25.00 per gallon</p>
                        </v-col>
                        <v-col col="12" md="6" sm="6" xs="12" class="">
                          <v-container d-flex align-center class="btn-group">
                            <v-row>
                              <v-btn
                                rounded="0"
                                class="btn-minus"
                                variant="plain"
                                size="small"
                                @click="toggleDecrease"
                                ><v-icon>mdi-minus</v-icon></v-btn
                              >
                              <p class="text-h6 text-center">{{ numberOfGallon }}</p>
                              <v-btn
                                rounded="0"
                                class="btn-plus"
                                variant="plain"
                                size="small"
                                @click="toggleIncrease"
                                ><v-icon>mdi-plus</v-icon></v-btn
                              >
                            </v-row>
                          </v-container>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <div class="text-center">
                    <v-btn rounded="0" class="add-address-btn mt-4 mb-4"
                      ><v-icon class="pr-3 text-center text-primary" size="large"
                        >mdi-plus-circle-outline</v-icon
                      ><span class="text-dark">Place a new order for another location</span>
                    </v-btn>
                  </div>
                  <div class="total-right mb-3"><h4>Total: ₱346 {{}}.00</h4></div>
                  <v-row class="cancel-order-btns">
                    <v-col col="12" md="6" class="text-start">
                      <v-btn variant="none" class="cancel-btn">Cancel</v-btn>
                    </v-col>
                    <v-col col="12" md="6" class="">
                      <v-btn variant="none" class="order-btn">Order Now</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
                <v-container class="bottom-btn mx-auto">
                  <v-row class="text-center mx-auto">
                    <v-col cols="12" md="4" sm="4" xs="4" class="set-sched-btn">
                      <router-link
                        :to="{ name: 'calendarorder' }"
                        :class="{ 'v-btn--active': $route.name === 'calendarorder' }"
                      >
                        <v-btn variant="none" class="full-btn">
                          <!-- External confirm/cancel buttons -->

                          <div>
                            <h3 class="set"><v-icon>mdi-calendar</v-icon> Set a delivery</h3>
                            <h3>schedule</h3>
                          </div>
                        </v-btn>
                      </router-link>
                    </v-col>

                    <v-col cols="12" md="4" sm="4" xs="4" class="bulk-btn">
                      <router-link class="no-underline" to="#">
                        <v-btn variant="none" class="full-btn">
                          <div>
                            <h5>Order in bulk</h5>
                            <h3>Save ₱10.00</h3>
                          </div>
                        </v-btn>
                      </router-link>
                    </v-col>

                    <v-col cols="12" md="4" sm="4" xs="4" class="order-bottom-btn">
                      <router-link class="no-underline" to="#">
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

                <!---->
              </v-col>

              <!--end Right Column-->
              <!-- calendar extension -->

              <v-col col="12" md="7" class="d-flex flex-column align-center" v-if="PageIsSelect">

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
                      href="#station-right-container-content"
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
                <!-- Shown below the date picker Remove if necessary   -->
                <!-- input rani para makita if mo gana ang add schedule -->

                <v-container class="right-container">
                  <v-row class="first-row">
                    <v-col col="6" class="grp-checkbox">
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
                    <v-divider></v-divider>
                  </v-row>

                  <v-row class="second-row">
                    <v-col col="12" md="2" sm="2"
                      ><!--1st row-->
                      <v-card class="text-center card-img" width="95"
                        ><img src="@/assets/img/gallon-aquasis.png"
                      /></v-card>
                    </v-col>

                    <v-col col="12" md="10" sm="10" class="pl-6"
                      ><!--second row-->
                      <v-row
                        ><!--1st row for 2nd row-->
                        <v-col col="12">
                          <h5 class="blue-color">Aquasis Water Refilling Station</h5>
                          <h6>Location: 177 Cancer St., Montilla Blvd Highway, Brgy JP Rizal</h6>
                        </v-col>
                      </v-row>
                      <v-row
                        ><!--2nd row for 2nd row-->
                        <v-col col="12" md="6" sm="6" xs="12" class="">
                          <p>₱ 25.00 per gallon</p>
                        </v-col>
                        <v-col col="12" md="6" sm="6" xs="12" class="">
                          <v-container d-flex align-center class="btn-group">
                            <v-row>
                              <v-btn
                                rounded="0"
                                class="btn-minus"
                                variant="plain"
                                size="small"
                                @click="toggleDecrease"
                                ><v-icon>mdi-minus</v-icon></v-btn
                              >
                              <p class="text-h6 text-center">{{ numberOfGallon }}</p>
                              <v-btn
                                rounded="0"
                                class="btn-plus"
                                variant="plain"
                                size="small"
                                @click="toggleIncrease"
                                ><v-icon>mdi-plus</v-icon></v-btn
                              >
                            </v-row>
                          </v-container>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <div class="text-center"></div>
                  <div class="total-right mb-3"><h4>Total: ₱346 {{}}.00</h4></div>
                  <v-row class="cancel-order-btns">
                    <v-col col="12" md="6" class="text-start">
                      <v-btn variant="none" class="cancel-btn" @click="cancelOutside">Cancel</v-btn>
                    </v-col>
                    <v-col col="12" md="6" class="">
                      <v-btn variant="none" class="order-btn" @click="confirmOutside"
                        >Order Now</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-container>
                <v-container class="bottom-btn mx-auto">
                  <v-row class="text-center mx-auto">
                    <v-col cols="12" md="4" sm="4" xs="4" class="set-sched-btn">
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

                    <v-col cols="12" md="4" sm="4" xs="4" class="bulk-btn">
                      <router-link class="no-underline" to="#">
                        <v-btn variant="none" class="full-btn">
                          <div>
                            <h5>Order in bulk</h5>
                            <h3>Save ₱10.00</h3>
                          </div>
                        </v-btn>
                      </router-link>
                    </v-col>

                    <v-col cols="12" md="4" sm="4" xs="4" class="order-bottom-btn">
                      <router-link class="no-underline" to="#">
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
      <!--End Card Station Area-->
    </template>
  </NavigationBar>
</template>

<script setup>
import StationLayout from '@/components/layout/StationLayout.vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
const selected = ref([''])
const items = ['']
const route = useRoute()
const SelectedPage = computed(() => route.name === 'aquasis')
const PageIsSelect = computed(() => route.name === 'calendarorder')

// Increasing and Decreasing number of gallon
const numberOfGallon = ref(0)
const toggleIncrease = () => {
  numberOfGallon.value++
}
const toggleDecrease = () => {
  if (numberOfGallon.value > 0) {
    numberOfGallon.value--
  }
}

// const date = ref(null)
// const tempModel = ref(null)
// const confirmActions = ref(null)
const showDateInput = ref(false)
// Capture model/actions for external access
// function capture(model, actions) {
//   tempModel.value = model
//   confirmActions.value = actions
//   return true
// }

// Format date
const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  return new Date(selectedDate.value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// External Save
// function confirmOutside() {
//   if (tempModel.value && confirmActions.value) {
//     date.value = tempModel.value.value
//     confirmActions.value.save(tempModel.value.value)
//   }
// }

// function cancelOutside() {
//   date.value = null
//   tempModel.value = null
//   if (confirmActions.value?.cancel) {
//     confirmActions.value.cancel()
//   }
// }



const isBulkOrder = ref(false)




// Method for bulk order
const orderInBulk = () => {
  numberOfGallon.value = 12
  isBulkOrder.value = true
}

// Computed property for calculating total price
const pricePerGallon = 20
const subtotal = computed(() => numberOfGallon.value * pricePerGallon)
const discount = computed(() => (isBulkOrder.value ? 10 : 0))
const totalPriceWithDiscount = computed(() => subtotal.value - discount.value)


const showCalendar = ref(false)
const selectedDate = ref(null);  // Stores the selected date (YYYY-MM-DD format)
function placeOrderButton() {
  showCalendar.value = false;  // Ensures calendar is hidden
  clickedButton.value = 'order';  // Marks "Deliver Now" as active
  // Note: Your current code doesn't automatically place the order here
}
const orderToSave = {
  // ...other data...
  calendar: selectedDate.value || new Date().toISOString().substr(0, 10)  // Uses selected date or today
};
function toggleCalendar() {
  showCalendar.value = true;  // Shows the calendar
  clickedButton.value = 'calendar';  // Marks the calendar button as active
}
function confirmDateSelection() {
  if (!selectedDate.value) {
    console.warn('No date selected!')
    return // Exit early if no date
  }

  formattedDate.value = new Date(selectedDate.value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  showDateInput.value = true
  showCalendar.value = false

  // Optional: Auto-scroll to form
  nextTick(() => {
    document.querySelector('#station-right-container-content')?.scrollIntoView({
      behavior: 'smooth'
    })
  })
}
const clickedButton = ref('') // For tracking which button was clicked

</script>

<style scoped>
.station-container {
  background-color: #bee1ed7e;
  margin-top: 2rem;
}
.top-style {
  padding: 0 45px;
}
h2 {
  color: #04448d;
  font-family: 'Familjen Grotesk', sans-serif;
  padding-left: 1rem;
  padding-top: 1rem;
}
.no-underline {
  text-decoration: none;
}
.close {
  color: #04448d;
  font-size: 2.8rem;
  padding: 0;
  margin: 0;
}
/*----Left side ---- */
.left-container {
  width: 100%;
}
@media (max-width: 600px) {
  .responsive-img {
    max-width: 100%;
  }
}

.img-style img {
  border: #04448d 3px solid;
  border-radius: 10px;
  margin-top: -15px;
}
.blue-color {
  color: #04448d;
  font-family: 'Familjen Grotesk', sans-serif;
}
.description-card {
  width: 84%;
}
.description p {
  font-family: 'familjen Grotesk', sans-serif;
  font-size: 15px;
}
.description span {
  font-size: 13px;
}
.description h3 {
  font-size: 26px;
  font-weight: 600;
}
.description h4 {
  font-size: 21px;
  font-weight: 700;
}
.shrink-line {
  line-height: 1.1;
}
.social-contact {
  background: none !important;
  text-transform: none;
  font-family: 'Inter', sans-serif;
  color: #fff;
  font-weight: 300;
  font-size: 16px;
  width: 85%;
  padding: 8px;
}
.contact-btn {
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  padding: 9px;
  border-radius: 15px;
  transition: background-position 0.5s ease;
  margin-bottom: 2rem;
  width: 90%;
}
.contact-btn:hover {
  background-position: right center;
}

/*---Right side--*/
.right-container {
  background-color: #dee8ef;
  border-radius: 15px 15px 0 0;
  border: 1px solid #04448d;
  width: 90%;
}
.first-row h4 {
  font-size: 18px;
}
.checkbox-one {
  margin-bottom: -3rem;
  font-family: 'Familjen Grotesk', sans-serif;
}
.checkbox-two {
  font-family: 'Familjen Grotesk', sans-serif;
  margin-bottom: -3rem;
}
.second-row {
  margin-top: 0.7rem;
  margin-bottom: 0.7rem;
}
.second-row .card-img {
  border: 1px solid #000000;
  border-radius: 7px;
}
.second-row h5 {
  font-size: 17px;
  font-family: 'Familjen Grotesk', sans-serif;
}
.second-row h6 {
  font-family: 'Familjen Grotesk', sans-serif;
  font-size: 13px;
  font-weight: 500;
}
.second-row p {
  font-family: 'Familjen Grotesk', sans-serif;
  font-size: 16px;
  padding-top: 1rem;
  font-weight: 600;
}
.btn-group {
  padding-bottom: 0;
}
.btn-group .btn-plus {
  border-left: #000000 1px solid;
  margin: 0 !important;
}
.btn-group .btn-minus {
  border-right: #000000 1px solid;
}

.btn-group .v-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: #d5dfe6;
  border: #000000 1px solid;
  margin: 0;
  width: 85%;
}

.btn-group p {
  margin: 0;
  padding: 0 0.5rem;
  font-weight: 600;
  font-size: 18px !important; /* similar to Vuetify's text-h6 */
  text-align: center;
  width: 20%;
}
.add-address-btn {
  text-transform: none;
  font-family: 'familjen Grotesk', sans-serif;
  font-size: 14px;
  border: #000000 1px solid;
  font-weight: 700;
  background-color: #d5dfe6;
  border-radius: 5px !important;
}
.total-right {
  text-align: right;
  margin-top: 1rem;
  padding-right: 3rem;
}
.cancel-order-btns {
  padding: 0 40px;
}
.order-btn {
  margin-left: auto;
  display: block;
}
.cancel-order-btns h4 {
  margin-left: 50%;
}
.order-btn {
  text-transform: none;
  font-family: 'Inter' sans-serif;
  background: #0557b6;
  background-size: 200% auto;
  background-position: left center;
  color: white;
  border-radius: 15px 0;
  text-transform: none;
  transition: background-position 0.5s ease;
  width: 55%;
}
.cancel-btn {
  width: 50%;
  text-transform: none;
  font-family: 'Inter', sans-serif;
  border: 2px solid #0557b6;
  border-radius: 15px 0;
  color: #04448d;
}
.order-btn:hover {
  background-position: right center;
}
/*set-sched-btn */
.set-sched-btn {
  border-radius: 15px 0 0 0;
}
.set-sched-btn h3 {
  color: #0557b6;
  font-weight: 700;
  font-size: 15px;
}
.set-sched-btn .v-btn {
  border-radius: 15px 0 0 0;
}
.set {
  margin-bottom: -0.3rem;
}
/*bulk-btn */
.bulk-btn h5 {
  font-family: 'familjen grotesk' sans-serif !important;
  color: #6d788e;
  font-weight: 700;
  font-size: 12px;
}
.bulk-btn h3 {
  font-family: 'familjen grotesk' sans-serif !important;
  color: #04448d;
  font-weight: 700;
  font-size: 15px;
}
/*order-bottom-btn */
.order-bottom-btn {
  border-radius: 0 15px 0 0;
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  transition: background-position 0.5s ease;
}
.order-bottom-btn:hover {
  background-position: right center;
}
.order-bottom-btn .v-btn {
  border-radius: 0 15px 0 0;
}
.order-bottom-btn h5 {
  font-family: 'familjen grotesk' sans-serif !important;
  color: #bdb8d3;
}
.order-bottom-btn h3 {
  font-family: 'familjen grotesk' sans-serif !important;
}
.set-sched-btn,
.bulk-btn,
.order-bottom-btn {
  margin: 0;
  padding: 0;
  border: 2px solid #04448d;
  background-color: #d5dfe6;
}
.bulk-btn {
  border-left: none;
}

.order-bottom-btn {
  border-left: none;
}

.full-btn {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-transform: none;
  color: #fff;
  text-align: center;
  border-radius: 0;
  padding: 0.75rem 0;
  margin: 0;
  box-sizing: border-box;
}


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
.custom-calendar {
  background-color: #dee8efc2;
  color: #000;
  border-radius: 12px;
  border: 3px solid #0557b6;
  padding: 1rem;
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 17px !important;
}
.custom-calendar .v-btn {
  border-radius: 15px;
}
.delivery-date {
  display: block;
  width: 100%;
  max-width: 600px;
  text-align: center;
  background-color: #dee8ef;
  border: 2px solid #0557b6;
  border-radius: 12px;
  color: #333;
  padding: 16px;
  margin: 16px auto; /* Center horizontally */
  font-weight: 500;
  position: relative; /* For proper positioning */
  z-index: 1; /* Ensure it appears above other elements */
  box-sizing: border-box; /* Include padding in width calculation */

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
@media (max-width:700px) {
  .delivery-date {
    font-size: 0.875rem; /* slightly smaller text */
    padding: 0.75rem;
    width: 90%;

  }
}
.blue-text {
  color: blue;
}
</style>
