  <template>
    <NavigationBar>
      <template #content>
        <v-container fluid class="bg-image" v-show="!mobile">
          <!--first row-->
          <v-container max-width="85%" class="pt-10">
            <v-row>
              <v-col xl="12" lg="6" md="6" sm="5" xs="12">
                <div class="title-phrase">
                  <h4 class="first-phrase">
                    Stay hydrated<v-icon class="icon-style">mdi-water</v-icon>
                  </h4>
                  <!---->
                </div>
              </v-col>
              <!--Search Barr Area-->
              <v-col cols="12" md="6" sm="7" class="search-bar" v-show="!mobile">
                <v-form class="search-form" role="search" @submit="handleSearch">
                  <v-row no-gutters>
                    <v-col cols="9" class="search-input">
                      <v-text-field
                        v-model="searchInput"
                        variant="outlined"
                        placeholder="Search for water stations nearby..."
                        density="comfortable"
                        hide-details
                        class="fst-italic"
                        prepend-inner-icon="mdi-magnify"
                        aria-label="Search"
                      ></v-text-field>

                      <!-- Suggestions Dropdown-->
                      <ul v-if="searchInput && filteredSuggestions.length" class="suggestion-list">
                        <li
                          v-for="(suggestion, index) in filteredSuggestions"
                          :key="index"
                          @click="selectSuggestion(suggestion)"
                        >
                          {{ suggestion }}
                        </li>
                      </ul>
                    </v-col>
                    <v-col cols="3">
                      <v-btn type="submit" class="search-btn" block>
                        <span>Search</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
          <!--end first row-->

          <!--second row-->
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

          <!--end second row-->
        </v-container>

        <!--MOBILE UI HERE-->
        <v-container v-show="mobile" class="bg-image-mobile">
          <div class="d-flex align-center justify-space-between px-5 pt-16">
            <div>
              <h4>Order Now!</h4>
            </div>
            <div>
              <router-link to="/home" class="text-decoration-none">
                <v-icon class="close">mdi-window-close</v-icon>
              </router-link>
            </div>
          </div>
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
          <div class="scroll-container">
            <div class="mobile-card" @click="addStationById(1)">
              <img :src="AquaSis" alt="Aquasis Water Station" />
              <button class="btn">View More Details</button>
            </div>
            <div class="mobile-card" @click="addStationById(2)">
              <img :src="Aquabon" alt="Aquabon Water Station" />
              <button class="btn">View More Details</button>
            </div>
            <div class="mobile-card" @click="addStationById(3)">
              <img :src="ColdPoint" alt="Cold Point" />
              <button class="btn">View More Details</button>
            </div>
            <div class="mobile-card" @click="addStationById(4)">
              <img :src="WaterDrops" alt="Water Drops" />
              <button class="btn">View More Details</button>
            </div>
          </div>
          <v-container class="station-container-mobile mb-10">
            <div v-for="(station, index) in selectableStations" :key="station.id" class="pa-2">
              <v-card flat class="d-flex align-center ">
                <!-- Checkbox and Image -->
                <v-row no-gutters align="center" class="w-100">
                  <v-col md="2" sm="3" xs="3" class="d-flex align-center justify-center">
                    <v-checkbox
                      v-model="station.selected"
                      density="compact"
                      hide-details
                      @click.stop.prevent
                      class="ma-0 pa-0"
                    ></v-checkbox>
                     <v-card class="text-center card-img ml-2" width="75">
                      <v-img
                        :src="station.image"
                        height="70"
                        width="40"
                        cover
                        style="border: 1px solid #ccc; border-radius: 4px;"
                      />
                    </v-card>
                  </v-col>

                  <!-- Right column: Station info and quantity controls -->
                  <v-col md="10" sm="9" xs="9">
                    <!-- Station name and location -->
                    <div>
                      <h5 class="blue-color mb-1">{{ station.name }}</h5>
                      <h6 class="text-caption mb-2">{{ station.location }}</h6>
                    </div>

                    <!-- Price and Quantity Controls -->
                    <v-row>
                      <v-col cols="12" md="6" sm="6">
                        <p>₱{{ station.price }} per gallon</p>
                      </v-col>
                      <v-col cols="12" md="6" sm="6" class="d-flex align-center">
                        <v-btn icon size="small" @click.stop="decreaseQty(index)">
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>
                        <span class="mx-2 font-weight-medium">{{ station.qty }}</span>
                        <v-btn icon size="small" @click.stop="increaseQty(index)">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>

                  <!-- Optional divider -->
                  <v-col cols="12">
                    <v-divider class="my-2"></v-divider>
                  </v-col>
                </v-row>
              </v-card>
            </div>
            <div class="text-right">
              <p>Total: ₱{{ totalPrice }}</p>
              <v-btn @click="checkout">Checkout</v-btn>
            </div>
          </v-container>
        </v-container>

      </template>
    </NavigationBar>
  </template>

<script setup>
import { ref } from 'vue'
import '@/assets/main.css'
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

 //suggestion search list
import { computed } from 'vue'
import { useRouter } from 'vue-router'
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
//station checkout in MOBILE UI
const allStations = [
  {
    id: 1,
    name: 'Aquasis Water Station',
    location: 'Brgy JP Rizal, Butuan City',
    price: 25,
    image: '@/assets/img/1.png',
  },
  {
    id: 2,
    name: 'Aquabon Water Station',
    location: 'Villa Kananga, Butuan City',
    price: 20,
    image: Aquabon,
  },
  {
    id: 3,
    name: 'Cold Point',
    location: 'Baladad Libertad, Butuan City',
    price: 25,
    image: ColdPoint,
  },
  {
    id: 4,
    name: 'Water Drops',
    location: 'Purok 1-B Ampayon, Butuan City',
    price: 20,
    image: WaterDrops,
  },
]

const selectableStations = ref([])

function addStationById(id) {
  const station = allStations.find((s) => s.id === id)
  if (station) {
    // Replace all previous stations with the newly selected one
    selectableStations.value = [
      {
        ...station,
        selected: true,
        qty: 1,
      },
    ]
  }
}

const totalPrice = computed(() =>
  selectableStations.value.reduce(
    (sum, station) => (station.selected ? sum + station.qty * station.price : sum),
    0
  )
)



function increaseQty(index) {
  selectableStations.value[index].qty++
}

function decreaseQty(index) {
  if (selectableStations.value[index].qty > 0) {
    selectableStations.value[index].qty--
  }
}

function checkout() {
  alert('Total: ₱' + totalPrice.value)
}

</script>

<style scoped>
.search-bar-mobile{
  margin-top: 0%;
}
/* Close Button */
.station-container .close {
  cursor: pointer;
  color: #04448d;
  transition: opacity 0.3s ease-in-out, transform 0.2s;
}

.station-container .close:hover {
  opacity: 0.5;
  transform: rotate(180deg);
}

.scroll-container {
      display: flex;
      overflow-x: auto;
      gap: 10px;
      padding: 10px;
      scroll-behavior: smooth;
    }

    .mobile-card {
      position: relative;
      width: 200px;
      height: 150px;
      border-radius: 10px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .mobile-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 10px;
    }

    .btn {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }

    /* Optional: Hide scrollbar */
    .scroll-container::-webkit-scrollbar {
      display: none;
    }
    .station-container-mobile{
      padding: 0%;
    }
</style>
