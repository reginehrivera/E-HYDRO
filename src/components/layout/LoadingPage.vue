<template>
  <transition name="fade">
    <div v-if="show" class="loading-screen">
      <div class="loading-content">
        <div class="loading-text">
          <span
            v-for="(letter, index) in letters"
            :key="index"
            class="letter"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            {{ letter }}
          </span>
        </div>
        <!-- Water icon (Unicode emoji) -->
        <div class="water-icon">💧</div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const letters = ['E', '-', 'H', 'Y', 'D', 'R', 'O']
const show = ref(true)

const emit = defineEmits(['loading-complete'])

onMounted(() => {
  setTimeout(() => {
    show.value = false
    emit('loading-complete')
  }, 3000)
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0a0a0a;
  z-index: 9999;
}

.loading-text {
  display: flex;
  gap: 8px;
  font-size: 44px;
  font-weight: bold;
  font-family: 'Segoe UI', 'Arial', sans-serif;
}

.letter {
  color: white;
  animation: wave 1.6s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes wave {
  0%,
  100% {
    transform: translateY(0);
    color: white;
  }
  50% {
    transform: translateY(-12px);
    color: #04a2eb;
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.water-icon {
  font-size: 36px;
  animation: bounce 1.5s infinite ease-in-out;
}

/* Bounce animation for water icon */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
