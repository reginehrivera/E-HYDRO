// LoadingPage.vue

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
      </div>
    </div>
  </transition>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

const letters = ['E', '-', 'H', 'Y', 'D', 'R', 'O']
const emit = defineEmits(['loading-complete'])

// Watch for show property changes
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      // When shown, schedule the completion event
      setTimeout(() => {
        emit('loading-complete')
      }, props.duration)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-text {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
  gap: 12px;
}

.letter {
  display: inline-block;
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

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
