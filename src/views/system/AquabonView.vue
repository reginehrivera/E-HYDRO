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
                                <v-tooltip activator="parent" location="bottom">Madam Bertud</v-tooltip>
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
                                <v-tooltip activator="parent" location="bottom">09517978870</v-tooltip>
                              </v-btn>
                            </router-link>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-col>
                  </v-row>

                  <v-divider :thickness="2" ></v-divider>

                  <!---RATING AND COMMENTS WILL REFLECT THIS AREA-->
                  <p class="review-style pl-8 pt-2">
                    {{ averageRating }} <v-icon color="yellow darken-2">mdi-star</v-icon> Ratings ({{ reviews.length }})
                    <v-tooltip activator="parent" location="right">Scroll down to view more reviews!</v-tooltip>
                  </p>
                  <v-container id="review-section" class="modal-content">
                    <v-card v-for="(review, index) in reviews" :key="index" class="mb-1 pl-5 pr-5 review-card">
                      <v-card-title class="d-flex align-center pt-2">
                        <v-row>
                        <v-col cols="12" md="2" class="">
                          <v-avatar size="40" class="pl-4">
                            <img :src="review.profilePhoto" alt="Profile" />
                          </v-avatar>
                        </v-col>
                        <v-col cols="12" md="10">
                          <div><P class="profile-name-style">{{ review.username }}</P></div>
                          <div class="text-caption"><p class="profile-email-style" >{{ review.email }}</p></div>
                        </v-col>
                      </v-row>
                      </v-card-title>
                      <v-rating :model-value="review.rating" density="compact" readonly color="yellow darken" class="review-star pl-4"/>
                      <v-card-text><p class="review-comment pl-2">{{ review.comment }}</p></v-card-text>
                    </v-card>
                  </v-container>
                  <!----->

                </v-container>
              </v-col>
              <!--End Left Column-->
              <!--Right Column-->
              <v-col cols="12" md="7" class="">
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
                  <v-row class="second-row">
                    <v-col cols="12" md="2" sm="2"><!--1st row-->
                      <v-card class="text-center card-img" width="95"
                        ><img src="@/assets/img/gallon-aquabon.png"
                      /></v-card>
                    </v-col>
                    <v-col cols="12" md="10" sm="10" class="pl-6"><!--second row-->
                      <v-row><!--1st row for 2nd row-->
                        <v-col cols="12">
                          <h5 class="blue-color">Aquasis Water Refilling Station</h5>
                          <h6>Location: 177 Cancer St., Montilla Blvd Highway, Brgy JP Rizal</h6>
                        </v-col>
                      </v-row>
                      <v-row><!--2nd row for 2nd row-->
                        <v-col cols="12" md="6" sm="6" xs="12" class="">
                          <p>₱ 25.00 per gallon</p>
                        </v-col>
                        <v-col cols="12" md="6" sm="6" xs="12" class="">
                          <v-container d-flex align-center class="btn-group   ">
                            <v-row>
                              <v-btn rounded="0" class="btn-minus" variant="plain" size="small" @click="toggleDecrease"
                                ><v-icon>mdi-minus</v-icon></v-btn
                              >
                              <p class="text-h6 text-center">{{ numberOfGallon }}</p>
                              <v-btn rounded="0" class="btn-plus" variant="plain" size="small" @click="toggleIncrease"
                                ><v-icon>mdi-plus</v-icon></v-btn>
                            </v-row>
                          </v-container>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <div class="text-center">
                    <v-btn rounded="0" class="add-address-btn mt-4 mb-4"
                      ><v-icon class="pr-3 text-center text-primary" size="large">mdi-plus-circle-outline</v-icon><span class="text-dark">Place a new order for another
                      location</span> </v-btn
                    >
                  </div>
                  <div class="total-right mb-3"><h4>Total: ₱ {{}}.00</h4></div>
                  <v-row class="cancel-order-btns">
                      <v-col cols="12" md="6" class="text-start ">
                        <v-btn variant="none" class="cancel-btn">Cancel</v-btn>
                      </v-col>
                      <v-col cols="12" md="6" class="">
                        <v-btn variant="none" class="order-btn">Order Now</v-btn>
                      </v-col>
                  </v-row>
                </v-container>
                <v-container>
                  <v-row class="text-center mx-auto">
                    <v-col cols="12" md="4" sm="4" xs="4" class="set-sched-btn">
                      <router-link class="no-underline" to="#">
                        <v-btn variant="none" class="full-btn">
                          <div>
                            <h3 class="set"><v-icon>mdi-calendar</v-icon> Set a delivery</h3>
                            <h3>schedule</h3>
                          </div>
                        </v-btn>
                      </router-link>
                    </v-col>

                    <v-col cols="12" md="4" sm="4" xs="4" class="bulk-btn">
                      <router-link class="no-underline" to="#" >
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
import '@/assets/main.css'

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

// Reviews
import { computed } from 'vue'
import { useReviewStore } from '@/stores/reviewStore'

const reviewStore = useReviewStore()

const stationId = 'station-123' // Should be dynamic (from route param maybe)
const reviews = computed(() => reviewStore.getReviewsByStation(stationId))

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.value.length).toFixed(1); // 1 decimal place
});
  
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
.review-style{
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 20px;
  font-weight: 600;
}
.profile-name-style{
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 16px;
  font-weight: 500;
}
.profile-email-style{
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 13px;
  font-weight: 400;
  padding-top: 0%;
  margin-top: -.50rem;
}
.review-card{
  border: #0557B6 1px solid;
  background-color: #DEE8EF;
}
.review-comment{
  font-family: 'Familjen Grotesk', Times, serif;
  font-size: 13px;
  margin-top: -.50rem;
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
</style>
