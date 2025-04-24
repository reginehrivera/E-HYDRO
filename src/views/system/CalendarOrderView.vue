<template>
<div>
<AquasisView/>
</div>
<v-card class="mx-auto pa-4" max-width="600"  rounded="lg" border>
            <v-confirm-edit v-model="date">
      <template v-slot:default="{ model, actions }">
        <v-row justify="center" >
        <v-date-picker hide-header="false" width="550" v-model="model.value" ref="datePickerRef" />
        <!-- Save references for use outside -->
      </v-row>
        <v-hover v-if="capture(model, actions)" />
      </template>
    </v-confirm-edit>
  </v-card>

                  <!-- Shown below the date picker Remove if necessary   -->
                   <!-- input rani para makita if mo gana ang add schedule -->
                <v-text-field
                  :model-value="formattedDate"
                  label="Confirmed Date"
                  readonly
                ></v-text-field>

</template>

<script setup>
import AquasisView from '@/views/system/AquasisView.vue'
import { ref,computed } from 'vue'

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
