  <template>
    <NavigationBar>
      <template #content>
        <v-container fluid class="bg-image">
          <!--first row-->
          <v-container max-width="85%" class="pt-10"> <!--added-->
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

</script>

