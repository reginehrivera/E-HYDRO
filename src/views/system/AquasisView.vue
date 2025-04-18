<template>
  <NavigationBar>
    <template #content>
      <DashboardLayout>
        <template #dashboardcontent>
          <!--Card Station Area-->
          <v-container class="mx-auto station-container" elevation="24">
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
              <v-col col="12" md="6">
                <v-container class="left-container">
                  <v-row no-gutters class="img-row">
                    <!-- <v-col col="12" md="5">
                      <img src="@/assets/img/Aquasis-shop.jpg" height="200" alt="test image" />
                    </v-col>-->
                    <v-col col="12" class="img-style text-center">
                      <img
                        src="@/assets/img/aquasis-img.jpg"
                        height="250"
                        width="450"
                        alt="test image"
                      />
                    </v-col>
                  </v-row>
                  <!--Description-->
                  <v-container class="description-card">
                  <v-row>
                    <v-col col="12" md="7" class="description  shrink-line">
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
                  <v-container class="contact-btn mx-auto text-center d-flex">
                    <router-link to="" class="no-underline mx-auto">
                    <v-btn
                      class="social-contact"
                      rounded="0"
                      variant="plain"
                      prepend-icon="mdi-facebook-messenger"
                      >Messenger
                      <v-tooltip activator="parent" location="bottom">Madam Bertud</v-tooltip></v-btn
                    ></router-link>
                    <router-link to="" class="no-underline mx-auto">
                    <v-btn
                      class="social-contact"
                      rounded="0"
                      variant="plain"
                      prepend-icon="mdi-phone"
                      >Contact Number<v-tooltip activator="parent" location="bottom">09517978870</v-tooltip></v-btn>
                    </router-link>
                  </v-container>
                  <v-divider></v-divider>
                  <!---RATING AND COMMENTS WILL REFLECT THIS AREA-->
                </v-container>
              </v-col>
              <!--End Left Column-->
              <!--Right Column-->
              <v-col col="12" md="6">
                <v-container class="right-container">
                  <v-row class="first-row">
                    <v-col col="6" class="grp-checkbox">
                      <h4 class="blue-color">Order Option</h4>
                      <v-container class="checkboxes">
                        <v-checkbox
                          v-model="selected"
                          label="Refill Only"
                          value="Refill Only"
                          class="checkbox-top"
                        ></v-checkbox>
                        <v-checkbox
                          v-model="selected"
                          label="Buy with New Gallon"
                          value="Buy with New Gallon"
                          class="checkbox-bottom"
                        ></v-checkbox>
                      </v-container>
                    </v-col>
                    <v-col col="6">
                      <h4 class="blue-color mb-3">Delivery Address Option</h4>
                      <v-select :items="items" label="Select Address..."></v-select>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-row class="second-row">
                    <v-col col="12" md="2">
                      <v-card class="text-center" width="95"
                        ><img src="@/assets/img/gallon-aquasis.png"
                      /></v-card>
                    </v-col>
                    <v-col col="12" md="6">
                      <h5 class="blue-color">Aquasis Water Refilling Station</h5>
                      <h6>Location: St. Montilla Blvd Highway, Brgy JP Rizal</h6>
                      <p>₱ 25.00</p>
                    </v-col>
                    <v-col col="12" md="4">
                      <v-container d-flex align-center ga-2>
                        <v-row>
                          <v-btn rounded="0" @click="toggleDecrease"
                            ><v-icon>mdi-minus</v-icon></v-btn
                          >
                          <p class="text-h6 mb-0 text-center">{{ numberOfGallon }}</p>
                          <v-btn rounded="0" @click="toggleIncrease"
                            ><v-icon>mdi-plus</v-icon></v-btn
                          >
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <div class="text-center">
                    <v-btn rounded="0" class="add-address-btn"
                      ><v-icon>mdi-plus-circle-outline</v-icon>Place a new order for another
                      location</v-btn
                    >
                  </div>
                  <v-row>
                    <v-col col="12" md="6">
                      <v-btn rounded="0" class="cancel-btn">Cancel</v-btn>
                    </v-col>
                    <v-col col="12" md="6">
                      <h3>Total: ₱{{ }}</h3>
                      <v-btn rounded="0" class="order-btn">Order Now</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
                <v-container class="bottom-btn">
                  <v-row class="justify-center">
                    <v-btn rounded="0" value="recent">
                      <v-icon>mdi-calendar</v-icon>
                      <p>Set a delivery</p>
                      <p>schedule</p>
                    </v-btn>

                    <v-btn rounded="0" value="favorites">
                      <span>Order in bulk</span>
                      <span>Save ₱10.00</span>
                    </v-btn>

                    <v-btn rounded="0" value="nearby">
                      <span>Order now</span>
                      <span>₱20 | each</span>
                    </v-btn>
                  </v-row>
                </v-container>
              </v-col>
              <!--end Right Column-->
            </v-row>
          </v-container>
        </template>
      </DashboardLayout>
      <!--End Card Station Area-->
    </template>
  </NavigationBar>
</template>

<script setup>
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'

import { ref } from 'vue'

const selected = ref([''])
const items = ['']

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
</script>

<style scoped>
.station-container {
  background-color: #bee1ed7e;
  margin-top: 2rem;
  padding: 20px;
}
.top-style{
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
.left-container{
  width: 85%;
}
.img-style {
  margin: 0 auto;
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
.description-card{
  margin-top: -.90rem;
} 
.description p {
  font-family: 'familjen Grotesk', sans-serif;
}
.description p .blue-color {
  font-size: 23px !important;
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
  background-color: none;
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
}

.contact-btn:hover {
  background-position: right center;
}

/*---Right side--*/
.right-container {
  background-color: #dee8ef;
  padding: 20px;
  border-radius: 15px 15px 0 0;
  border: 1px solid #04448d;
  width: 90%;
}
.first-row h4{
  font-size: 18px;
}
.checkboxes{
  gap: rem;
}
</style>
