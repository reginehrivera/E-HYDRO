<script setup>
import { ref, onMounted } from 'vue'
import LoadingPage from '@/components/layout/LoadingPage.vue'
// State to control loading screen visibility
const showLoading = ref(true)

// Handle loading completion
const handleLoadingComplete = () => {
  showLoading.value = false
}

// Optional: If you want to show loading screen on every visit
onMounted(() => {
  showLoading.value = true
})
</script>

<template>
  <!-- Loading page component -->
  <LoadingPage :show="showLoading" :duration="3000" @loading-complete="handleLoadingComplete" />

  <!-- Main landing page content - only visible when loading is complete -->
  <div v-show="!showLoading">
    <v-container fluid class="fill-height bg-image d-flex align-center justify-center">
      <div class="button-wrapper">
        <RouterLink to="/login">
          <v-btn class="custom-btn">Get Started</v-btn>
        </RouterLink>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
/* Background styling */
.bg-image {
  background-image: url('@/assets/img/landing.png');
  background-size: cover;
  background-position: center;
  height: 100%;
}

.fill-height {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.button-wrapper {
  margin-top: 8rem; /* Adjust this value as needed (e.g., 2rem, 4rem) */
}

/* Button styles */
.custom-btn {
  width: 15em;
  font-size: 16px;
  border-radius: 0 2rem;
  background-color: #015dc7 !important;
  color: white !important;
  text-transform: none;
  font-weight: 600;
}

.custom-btn:hover {
  background-color: #04448d !important;
  opacity: 1;
  border: 2px solid #0c3b2e;
}

.text-white {
  color: white !important;
}
</style>
