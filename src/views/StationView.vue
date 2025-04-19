<template>
  <NavigationBar>
    <template #content>
      <v-container fluid class="bg-image">
        <!--first row-->
        <v-row>
          <v-col col="12" md="6">
            <div class="title-phrase">
              <h4 class="first-phrase">
                Stay hydrated<v-icon class="icon-style">mdi-water</v-icon>
              </h4>
              <!---->
            </div>
          </v-col>
          <!--Search Barr Area-->
          <v-col col="12" md="6" class="search-bar">
            <v-form class="search-form" role="search">
              <v-row no-gutters>
                <v-col cols="9" class="search-input">
                  <v-text-field
                    variant="outlined"
                    placeholder="Search for water stations nearby..."
                    density="comfortable"
                    hide-details
                    class="fst-italic"
                    prepend-inner-icon="mdi-magnify"
                    aria-label="Search"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-btn type="submit" class="search-btn" color="" block
                    ><span>Search </span></v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
        <!--end first row-->

        <!--second row-->
        <v-row>
          <v-col class="d-flex justify-center" cols="12">
            <!--Station Card-->
            <v-card class="mx-auto station-card" max-width="85%" elevation="24">
              <v-card-title class="text-center pt-10">
                <h2 class="text-h5">Available Water Refilling Stations</h2>
                <h4 class="second-phrase">
                  Place your order here<v-icon class="cart-run">mdi-cart-variant</v-icon>
                </h4>
                <v-slide-group v-model="model" class="pa-1" show-arrows>
                  <v-slide-group-item
                    v-for="(img, index) in images"
                    :key="index"
                    v-slot="{ toggle, selectedClass }"
                  >
                    <router-link :to="img.route" class="no-underline">
                      <v-card
                        :class="['ma-2', selectedClass]"
                        height="480"
                        width="300"
                        @click="toggle"
                        class="slide-group-style"
                      >
                        <v-card elevation="0" class="image-card">
                          <v-img :src="img.src" class="mb-1 images"></v-img>
                          <h4 class="pb-1 text-white order-now-text">Order Now!</h4>
                        </v-card>
                        <v-card-title class="text-wrap text-start text-title">
                          {{ img.title }}
                        </v-card-title>
                        <v-card-text class="text-subtitle-2 text-start text-description">
                          <v-icon>mdi-map-marker</v-icon> {{ img.description }}
                        </v-card-text>
                        <v-card-text class="text-subtitle-2 text-start text-price">
                          {{ img.price }}
                        </v-card-text>
                        <v-footer class="text-subtitle-2 text-start text-available">
                          <v-icon class="text-success">mdi-circle</v-icon> Available
                        </v-footer>
                      </v-card>
                    </router-link>
                  </v-slide-group-item>
                </v-slide-group>
              </v-card-title>
              <v-card-subtitle class="pb-0"> </v-card-subtitle>
            </v-card>
            <!--End of station card-->
          </v-col>
        </v-row>
        <!--end second row-->
      </v-container>
    </template>
  </NavigationBar>
</template>

<script setup>
import { ref } from 'vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import WaterDrops from '@/assets/img/waterdrops-shop.png'
import AquaSis from '@/assets/img/Aquasis-shop.jpg'
import Aquabon from '@/assets/img/Aquabon-shop.png'
import ColdPoint from '@/assets/img/coldpoint-shop.jpg'

// Model for v-model binding
const model = ref(0)

// Reactive array of image objects
const images = ref([
  {
    src: AquaSis,
    title: 'Aquasis Water Station',
    description: 'Brgy JP Rizal, Butuan City',
    price: '₱25.00 per gallon',
    route: '/',
  },
  {
    src: Aquabon,
    title: 'Aquabon Water Station',
    description: 'Villa Kananga, Butuan City',
    price: '₱20.00 per gallon',
    route: '/',
  },
  {
    src: ColdPoint,
    title: 'Cold Point',
    description: 'Baladad Libertad, Butuan City',
    price: '₱25.00 per gallon',
    route: '/',
  },
  {
    src: WaterDrops,
    title: 'Water Drops',
    description: 'Purok 1-B Ampayon, Butuan City',
    price: '₱20.00 per gallon',
    route: '/',
  },
])
</script>

<style scoped>
.bg-image {
  background-image: url('@/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.title-phrase {
  font-family: 'familjen-grotesk', sans-serif;
  font-size: 23px !important;
  color: #04448d;
  font-style: italic;
  padding-left: 15%;
  padding-top: 11% !important;
}

@keyframes water-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.icon-style {
  font-size: 35px;
  color: #02adef;
  animation: water-bob 2s infinite ease-in-out;
}

.first-phrase {
  font-weight: 700;
  font-family: 'Faustina', serif;
}
.first-phrase {
  margin-bottom: -0.6rem;
}
.second-phrase {
  color: #02adef;
  font-family: 'Inter', sans-serif;
  font-style: italic;
  font-weight: 500;
}
@keyframes cart-run {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(5px) rotate(-2deg);
  }
  50% {
    transform: translateX(10px) rotate(2deg);
  }
  75% {
    transform: translateX(5px) rotate(-1deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}

.cart-run {
  display: inline-block;
  animation: cart-run 1s infinite ease-in-out;
  font-size: 35px;
  color: #02adef; /* You can change this to fit your theme */
}

/*-------Search Bar---------*/

.search-bar {
  padding-top: 10%;
  padding-right: 8%;
}
.search-input {
  position: relative;
}

/* Animated gradient border */
.search-input .v-text-field {
  position: relative;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  color: #fff;
  overflow: hidden;
  z-index: 1;
}

/* The running border using a ::before pseudo-element */
.search-input .v-text-field::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  z-index: -1;
  border-radius: 12px;
  background: linear-gradient(270deg, #90caf9, #42a5f5, #89c4dd, #408db3, #90caf9);
  background-size: 400% 400%;
  animation: gradient-run 6s ease infinite;
  opacity: 1; /* Always visible */
}

/* Animation keyframes */
@keyframes gradient-run {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.search-btn {
  width: 100%;
  height: 93%;
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  transition: background-position 0.5s ease;
  margin-top: 0.11rem;
}
.search-btn:hover {
  background-position: right center;
}
.search-btn span {
  font-family: 'inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  color: #fff;
}
/*-------End Search Bar---------*/

/*-------Station Cards---------*/
.no-underline {
  text-decoration: none;
  color: inherit;
}
.station-card {
  background-color: #bee1ed7e;
}
.text-h5 {
  font-family: 'Inter', sans-serif !important;
  font-weight: 700;
  color: #04448d;
}
.slide-group-style {
  background-color: #bee1ed00;
}
.image-card {
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  text-transform: none;
  transition: background-position 0.5s ease;
}
.image-card:hover {
  background-position: right center;
}
.order-now-text {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px !important;
}
.text-title,
.text-description,
.text-price,
.text-available {
  font-family: 'Inter', sans-serif !important;
}
.text-title {
  font-weight: 700;
  color: #04448d;
  font-size: 20px !important;
}
.text-description {
  margin-top: -0.5rem;
  font-weight: 500 !important;
  color: #04448d;
}
.text-price {
  margin-top: -1.5rem;
  color: #fff !important;
  font-size: 20px !important;
  font-weight: 600 !important;
}
.text-available {
  color: #0557b6 !important;
  font-size: 13px !important;
  background-color: #bee1ed00;
  margin-top: -1.7rem;
}
</style>
