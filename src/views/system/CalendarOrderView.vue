<template>
  <div>
    <AquasisView />
  </div>
</template>
<script setup>
import AquasisView from '@/views/system/AquasisView.vue'
import { ref, computed } from 'vue'

const date = ref(null)
const tempModel = ref(null)
const confirmActions = ref(null)

// Capture model/actions for external access
function capture(model, actions) {
  tempModel.value = model
  confirmActions.value = actions
  return true
}

// Format date
const formattedDate = computed(() => {
  if (!date.value) return ''
  const d = new Date(date.value)
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
})

// External Save
function confirmOutside() {
  if (tempModel.value && confirmActions.value) {
    date.value = tempModel.value.value
    confirmActions.value.save(tempModel.value.value)
  }
}

// External Cancel
</script>
