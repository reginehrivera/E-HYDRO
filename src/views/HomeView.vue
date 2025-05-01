<template>
  <NavigationBar>
    <template #content>
      <v-container fluid class="bg-image" v-show="!mobile">
        <v-row>
          <v-col cols="12" md="5" class="pt-16">
            <h1></h1>
            <p></p>
          </v-col>
          <v-col cols="12" md="7" class="home-h2">
            <h2>
              We provide clean, safe, and <br />
              worry-free water delivered right <br />
              to your doorstep.
            </h2>
            <router-link to="/station"
              ><v-btn class="home-btn"><span>Order Now!</span></v-btn>
            </router-link>
            <!--footer icons-->
            <ul class="footer-icons">
              <li><img :src="firstIcon" alt="" />Convenient <br />Ordering</li>
              <li>
                <img :src="secondIcon" alt="" />Offers <br />Affordable and <br />Quality Water
              </li>
              <li>
                <img :src="thirdIcon" alt="" />Deliver quickly<br />
                to your <br />doorstep
              </li>
              <li>
                <img :src="fourthIcon" alt="" />Recommend a Clean<br />
                & Safe Water <br />Refilling Station
              </li>
            </ul>
            <!--End footer icons-->
          </v-col>
        </v-row>
      </v-container>
      <!--first-view in mobile view-->
      <v-container class="mobile-view-container bg-image-mobile" v-show="mobile">
        <v-card class="mobile-view-card">
          <v-card class="text-card">
            <h2>Stay hydrated,<br />Place your order now!</h2>
          </v-card>
        </v-card>
        <!--Search Area-->
        <div class="search-bar-mobile">
          <form @submit.prevent="handleSearch" class="search-form">
            <div class="search-input-wrapper">
              <input
                type="search"
                v-model="searchInput"
                placeholder="Search nearby station..."
                class="search-input-mobile visible"
              />

              <!--Suggestions Dropdown-->
              <ul v-if="searchInput && filteredSuggestions.length" class="suggestion-list">
                <li
                  v-for="(suggestion, index) in filteredSuggestions"
                  :key="index"
                  @click="selectSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </li>
              </ul>
            </div>
          </form>
          <span class="search-style-btn">
            <v-icon>mdi-magnify</v-icon>
          </span>
        </div>
        <!---->
        <div class="station-div-mobile">
          <v-card-title class="text-center station-card-mobile">
            <h2 class="text-h5">Available Water Refilling Stations</h2>
            <h4 class="second-phrase">
              Place your order here<v-icon class="cart-run">mdi-cart-variant</v-icon>
            </h4>
            <v-slide-group v-model="model" show-arrows>
              <v-slide-group-item
                v-for="(img, index) in images"
                :key="index"
                v-slot="{ toggle, selectedClass }"
              >
                <router-link :to="img.route" class="no-underline">
                  <v-card
                    :class="['ma-1', selectedClass]"
                    height="265"
                    width="230"
                    @click="toggle"
                    class="slide-group-style"
                  >
                    <v-card elevation="46px" class="image-card">
                      <v-img :src="img.src" class="mb-1 images"></v-img>
                      <h4 class="pb-1 text-white order-now-text">Order Now</h4>
                    </v-card>
                  </v-card>
                </router-link>
              </v-slide-group-item>
            </v-slide-group>
          </v-card-title>
        </div>
      </v-container>
      <!---->
    </template>
  </NavigationBar>
</template>

<script setup>
import { ref } from 'vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import firstIcon from '@/assets/img/first-icon.png'
import secondIcon from '@/assets/img/second-icon.png'
import thirdIcon from '@/assets/img/third-icon.png'
import fourthIcon from '@/assets/img/fourth-icon.png'
import WaterDrops from '@/assets/img/waterdrops-shop.png'
import AquaSis from '@/assets/img/Aquasis-shop.jpg'
import Aquabon from '@/assets/img/Aquabon-shop.png'
import ColdPoint from '@/assets/img/coldpoint-shop.jpg'
import '@/assets/main.css'

// Model for v-model binding
const model = ref(0)

// Reactive array of image objects
const images = ref([
  {
    src: AquaSis,
    title: 'Aquasis Water Station',
    description: 'Brgy JP Rizal, Butuan City',
    price: '₱25.00 per gallon',
    route: '/aquasis',
  },
  {
    src: Aquabon,
    title: 'Aquabon Water Station',
    description: 'Villa Kananga, Butuan City',
    price: '₱20.00 per gallon',
    route: '/aquabon',
  },
  {
    src: ColdPoint,
    title: 'Cold Point',
    description: 'Baladad Libertad, Butuan City',
    price: '₱25.00 per gallon',
    route: '/coldpoint',
  },
  {
    src: WaterDrops,
    title: 'Water Drops',
    description: 'Purok 1-B Ampayon, Butuan City',
    price: '₱20.00 per gallon',
    route: '/waterdrops',
  },
])
// Hides search bar when not mobile
import { onMounted, onUnmounted } from 'vue'
const mobile = ref(null)
const mobileNav = ref(null)
const windowWidth = ref(window.innerWidth)

const checkScreen = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value <= 750) {
    mobile.value = true
  } else {
    mobile.value = false
    mobileNav.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', checkScreen)
  checkScreen()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})
//Search Area
import { computed } from 'vue'
import { useRouter } from 'vue-router'

//suggestion search listanded
const searchInput = ref('')
const router = useRouter()

const stations = {
  aquasis: '/aquasis',
  aquabon: '/aquabon',
  'cold point': '/coldpoint',
  'water drops': '/waterdrops',
}

const filteredSuggestions = computed(() => {
  const input = searchInput.value.toLowerCase()
  return Object.keys(stations).filter((station) => station.toLowerCase().includes(input))
})

const handleSearch = (e) => {
  e.preventDefault()
  const input = searchInput.value.trim().toLowerCase()
  if (stations[input]) {
    router.push(stations[input])
    searchInput.value = ''
  } else {
    alert('Station not found. Try Aquasis, Aquabon, Cold Point, or Water Drops.')
  }
}

const selectSuggestion = (station) => {
  searchInput.value = station
  const lowerStation = station.toLowerCase()
  if (stations[lowerStation]) {
    router.push(stations[lowerStation])
    searchInput.value = '' // clear after clicking suggestion (optional)
  } else {
    alert('Station not found.')
  }
}
</script>

<style scoped>
.bg-image {
  background-image: url('@/assets/img/bg-home.png');
  background-size: cover;
  background-position: center !important;
  background-repeat: no-repeat !important;
  min-height: 100vh;
}
.home-h2 h2 {
  font-family: 'familjen-grotesk', sans-serif;
  font-size: 19px;
  color: #0557b6;
  font-style: italic;
  font-weight: 600;
  padding-left: 9%;
  padding-top: 22% !important;
}

.home-btn {
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  color: white;
  font-family: 'familjen-grotesk', sans-serif;
  font-size: 17px;
  font-weight: 700 !important;
  padding: 9px 22px;
  border-radius: 20px 0;
  margin-left: 9%;
  margin-top: 15px;
  text-transform: none;
  transition: background-position 0.5s ease;
}
.home-btn span {
  font-weight: 600;
}

.home-btn:hover {
  background-position: right center;
}

/*-----Footer-icon-----*/
.footer-icons {
  margin-left: 10%;
  margin-top: 26%;
  display: flex;
  gap: 30px;
  /*justify-content: center;*/
  flex-wrap: wrap; /*ensures it wraps on smaller screens */
  padding: 0;
  list-style: none;
}

.footer-icons li {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 160px;
  font-size: 11px;
  font-family: 'familjen-grotesk', sans-serif;
  font-weight: 600;
  color: #04448d;
  line-height: 1.4;
  animation: floatUpDown 3s ease-in-out infinite;
}

/* Floating animation like water */
@keyframes floatUpDown {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}

.footer-icons img {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
  border: 1px solid #04448d;
  border-radius: 50%;
}

/**-----------For mobile UI style--------- */
.bg-image-mobile {
  background-image: url('@/assets/img/body.png');
  background-size: cover;
  background-position: center !important;
  background-repeat: no-repeat !important;
  min-height: 100vh;
  padding-bottom: 2%;
  padding-top: 0%;
  padding-left: 0%;
  padding-right: 0%;
}
.mobile-view-card {
  background-image: url('@/assets/img/mobile-bg-five.png');
  background-size: cover;
  background-position: center !important;
  background-repeat: no-repeat !important;
  border-radius: 0 0 25px 25px;
  padding: 0%;
  border-bottom: #04448d 2px solid;
}
.text-card {
  background: #d6dbdd88;
  color: white;
  font-family: 'familjen-grotesk', sans-serif;
  font-size: 20px;
  margin-top: 25%;
  width: 55%;
  padding: 4%;
  border-radius: 0 20px 20px 0 !important;
  margin-bottom: 10%;
  border-bottom: #0557b6 5px solid;
}
.text-card h2 {
  font-family: 'faustina', sans-serif;
  font-style: italic;
  font-weight: 800;
  font-size: 19px !important;
  color: #0557b6;
}
.station-card-mobile {
  padding-top: 5%;
  padding-left: 0%;
  padding-right: 0%;
  margin-bottom: 20%;
  background-color: #4c585b4f;
  border-radius: 20px;
  border-top: #ffffffcc 2px solid;
  border-bottom: #ffffffcc 2px solid;
}

@media (max-width: 750px) {
  h2 {
    font-family: 'familjen-grotesk', sans-serif;
    font-size: 16px !important;
    color: #0557b6;
    font-style: normal;
    font-weight: 600;
  }
  .home-btn span {
    font-weight: 600;
  }
  .second-phrase {
    font-size: 14px;
    color: #fff;
  }
  .cart-run {
    font-size: 21px;
    color: #04448d;
    margin-top: -0.75rem;
  }
  .home-btn:hover {
    background-position: right center;
  }
  /*-------Station Cards Mobile UI---------*/
  .text-h5 {
    font-family: 'Inter', sans-serif !important;
    font-weight: 700;
    color: #04448d;
  }
  .slide-group-style {
    background-color: #bee1ed00;
    border-radius: 20px;
    border: 1px solid #0557b6;
    margin-top: 1rem !important;
  }
  .image-card {
    background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
    background-size: 200% auto;
    background-position: left center;
    text-transform: none;
    transition: background-position 0.5s ease;
    border-radius: 20px;
    padding-bottom: 6px;
  }
  .image-card:hover {
    background-position: right center;
  }
  .order-now-text {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 15px !important;
    padding-top: 3px;
  }
}
/*-------Search Bar Mobile---------*/

.search-bar-mobile {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: -.50rem;
}

/* Always expanded input */
.search-bar-mobile .search-input-mobile {
  width: 280px; /* expanded width */
  padding: 5px;
  border: 1px solid #04448d;
  border-radius: 20px 0 0 20px;
  font-size: 15px;
  color: #04448d;
}
.search-style-btn {
  padding-top: 8px;
  padding-bottom: 7px;
  padding-left: 12px;
  padding-right: 15px;
  border-radius: 0 20px 20px 0;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  transition: background-position 0.5s ease;
  font-size: 13px;
}
.search-style-btn:hover {
  background-position: right center;
}
.search-bar-mobile{
  padding-top: 4%;
  padding-bottom: 5%;
  justify-content: center;
}

.search-input-wrapper {
  position: relative;
}

.suggestion-list {
  position: absolute;
  top: 100%;
  left: 0;
  background: #ffffffee;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}
.suggestion-list li {
  padding: 8px 12px;
  cursor: pointer;
  font-family: 'familjen grotesk', Courier, monospace;
  font-size: 14px;
  color: #04448d;
}
</style>
