<template>
  <v-container fluid class="bg-image">
    <!--first row-->
    <v-row>
      <v-col col="12" md="6">
        <div class="title-phrase">
          <h4 class="first-phrase">
            Stay hydrated
            <v-icon class="icon-style">mdi-water</v-icon>
          </h4>
        </div>
      </v-col>

      <!--Search Bar Area - Hidden when scrolled-->
      <v-col col="12" md="6" class="search-bar" :class="{ 'search-hidden': isScrolled }">
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
                @input="onSearchInput"
              ></v-text-field>
              <!-- Suggestions Dropdown -->
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
              <v-btn type="submit" class="search-btn" color="" block>
                <span>Search</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <!--end first row-->
    <slot name="dashboardcontent"></slot>
  </v-container>
</template>

<script setup>
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const searchInput = ref('')
const router = useRouter()
const isScrolled = ref(false)

const stations = {
  aquasis: '/aquasis',
  'aquasis water station': '/aquasis',
  aquabon: '/aquabon',
  'aquabon water station': '/aquabon',
  'cold point': '/coldpoint',
  'water drops': '/waterdrops',
}

// Search suggestions for both local and navbar search
const searchSuggestions = [
  'Aquasis Water Station',
  'Aquabon Water Station',
  'Cold Point Water Station',
  'Water Drops Water Station',
]
// Computed to filter suggestions based on input
const filteredSuggestions = computed(() => {
  const input = searchInput.value.toLowerCase()
  return searchSuggestions.filter((station) => station.toLowerCase().includes(input))
})

const handleSearch = (e) => {
  if (e) e.preventDefault()
  const input = searchInput.value.trim().toLowerCase()
  if (stations[input]) {
    router.push(stations[input])
    searchInput.value = '' // clear after search
  } else {
    alert('Station not found. Try Aquasis, Aquabon, Cold Point, or Water Drops.')
  }
}

const selectSuggestion = (station) => {
  searchInput.value = station
  const lowerStation = station.toLowerCase()

  if (stations[lowerStation]) {
    router.push(stations[lowerStation])
    searchInput.value = ''
  } else {
    // Try to find partial matches
    const matchingStation = Object.keys(stations).find(
      (key) => key.includes(lowerStation) || lowerStation.includes(key),
    )

    if (matchingStation) {
      router.push(stations[matchingStation])
      searchInput.value = ''
    } else {
      alert('Station not found.')
    }
  }
}
const onSearchInput = () => {
  // This function can be used for real-time search updates
  // For now, it's just a placeholder that can be extended
}

// Handle scroll to show/hide search bar
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// Provide search data to parent components (like navbar)
const stationSearchData = {
  searchInput,
  searchSuggestions,
  filteredSuggestions,
  handleSearch,
  selectSuggestion,
  onSearchInput,
}

provide('stationSearchData', stationSearchData)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check initial scroll position
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.bg-image {
  background-image: url('@/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding-top: 100px;
}

.title-phrase {
  font-family: 'familjen-grotesk', sans-serif;
  font-size: 23px !important;
  color: #04448d;
  font-style: italic;
  padding-left: 15%;
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
  margin-bottom: -0.6rem;
}

/*-------Search Bar---------*/

.search-bar {
  padding-top: 4%;
  padding-right: 8%;
  transition: all 0.3s ease;
}

/* Hide search bar when scrolled */
.search-hidden {
  opacity: 0;
  transform: translateY(-20px);
  pointer-events: none;
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
  opacity: 1;
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

/*-------Station Style-------*/
.station-container {
  background-color: #bee1ed7e;
}

/* Suggestions List */
.suggestion-list {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  background: white;
  color: black;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
  border-radius: 4px;
}

.suggestion-list li {
  padding: 8px 12px;
  cursor: pointer;
}

.suggestion-list li:hover {
  background-color: #e3f2fd;
}
</style>
