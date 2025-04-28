<script setup>
import '@/assets/main.css'
//for search bar

// Hides search bar when not mobile
import { ref, onMounted, onUnmounted } from 'vue'
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
</script>

<template>
      <v-container fluid class="bg-image">
        <!--first row-->
        <v-container max-width="85%" class="pt-10"> <!--added-->
            <v-row>
              <v-col xl="12" lg="6" >
                <div class="title-phrase">
                  <h4 class="first-phrase">
                    Stay hydrated<v-icon class="icon-style">mdi-water</v-icon>
                  </h4>
                  <!---->
                </div>
              </v-col>
              <!--Search Barr Area-->
              <v-col cols="12" md="6" class="search-bar" v-show="!mobile">
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
        <slot name="dashboardcontent"></slot>
      </v-container>
</template>

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
  padding-top: 5% !important;
  padding-left: 0%;
  margin-left: 0%;
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

/*-------Station Style-------*/
.station-container {
  background-color: #bee1ed7e;
}

</style>
