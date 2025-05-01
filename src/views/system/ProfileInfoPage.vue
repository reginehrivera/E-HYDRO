<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user' // Import the Pinia store
import { useRouter } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import MyAccountView from '@/views/MyAccountView.vue'
// Access the Pinia store
const userStore = useUserStore()

const formAction = ref({ formProcess: false })
const profileImage = ref(null)
const isLoadingUser = ref(false)
const router = useRouter()

onMounted(() => {
  formAction.value.formProcess = true
  // Fetch user profile data from the store
  profileImage.value = userStore.avatar_url
  formAction.value.formProcess = false
})

// Function to navigate to MyAccount page
const goToMyAccount = () => {
  router.push('/MyAccount')
}
</script>

<template>

  <NavigationBar />
  <MyAccountView>
    <!-- This content will appear inside the <slot /> in MyAccountView.vue -->
    <v-row>

<v-col cols="12">
  <div class="profile-section d-flex flex-column align-center justify-center pa-6">
    <div class="profile-wrapper">
      <v-card class="pa-6 profile-card" flat>
        <v-avatar class="avatar mt-5 mb-4" size="200">
          <v-img
            :src="profileImage || 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'"
            cover
          />
        </v-avatar>

        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="field-label">Full Name</div>
                <div class="field-value">{{ userStore.fullname || 'N/A' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">Mobile Number</div>
                <div class="field-value">{{ userStore.mobile || 'N/A' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">Email</div>
                <div class="field-value">{{ userStore.email || 'N/A' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">Address</div>
                <div class="field-value">{{ userStore.address || 'N/A' }}</div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div class="d-flex justify-center mt-4">
          <v-btn color="#0c3b2e" variant="outlined" @click="goToMyAccount">
            Edit Profile
          </v-btn>
        </div>
      </v-card>
    </div>
  </div>

  <v-overlay
    :model-value="formAction.formProcess || isLoadingUser"
    class="align-center justify-center"
  >
    <v-progress-circular indeterminate size="64" />
  </v-overlay>
</v-col>
</v-row>
      <!-- More content here -->
    </v-card>
  </MyAccountView>


</template>

<style scoped>

</style>
