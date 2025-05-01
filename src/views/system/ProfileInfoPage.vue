<script setup>
import { computed, ref, onMounted } from 'vue' // Make sure to import computed
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'
<<<<<<< HEAD
import MyAccountView from '@/views/MyAccountView.vue'
// Access the Pinia store
=======

>>>>>>> 2ffcaa2fc1a6450e7d51fa1e2cb0f6dd53d0be1b
const userStore = useUserStore()

const formAction = ref({ formProcess: false })
const isLoadingUser = ref(false)
const router = useRouter()

const avatarUrl = computed(() => userStore.avatarUrl)
const initials = computed(() => {
  const name = userStore.fullname || ''
  const parts = name.split(' ')
  if (parts.length > 1) {
    return parts[0][0] + parts[1][0]
  } else if (parts.length === 1) {
    return parts[0][0]
  }
  return ''
})

// Function to navigate to MyAccount page
const goToMyAccount = () => {
  router.push('/MyAccount')
}
</script>

<template>
<<<<<<< HEAD
=======
  <NavigationBar>
    <template #content>
      <v-row>
        <v-col cols="12">
          <div class="profile-section d-flex flex-column align-center justify-center pa-6">
            <div class="profile-wrapper">
              <v-card class="pa-6 profile-card" flat>
                <!-- Avatar centered -->
                <div class="d-flex justify-center mb-6">
                  <v-avatar color="deep-purple lighten-3" size="150">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                    <span v-else class="text-h5">{{ initials || '??' }}</span>
                  </v-avatar>
                </div>
>>>>>>> 2ffcaa2fc1a6450e7d51fa1e2cb0f6dd53d0be1b

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

<<<<<<< HEAD
=======
.profile-wrapper {
  width: 100%;
  max-width: 900px;
}

.profile-card {
  background-color: #fffdf6;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  width: 100%;
}

.avatar {
  display: block;
  margin: 0 auto;
}

.avatar-img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.field-label {
  font-size: 0.85rem;
  color: #0c3b2e;
  font-weight: 600;
  margin-bottom: 4px;
}

.field-value {
  font-size: 1rem;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 6px;
  min-height: 45px;
  display: flex;
  align-items: center;
}
>>>>>>> 2ffcaa2fc1a6450e7d51fa1e2cb0f6dd53d0be1b
</style>
