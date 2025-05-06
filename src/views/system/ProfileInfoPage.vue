<script setup>
import { computed, ref} from 'vue' //onMounted
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import MyAccountView from '@/views/MyAccountView.vue'

const userStore = useUserStore()

const formAction = ref({ formProcess: false })
const isLoadingUser = ref(false)
const router = useRouter()
const avatarUrl = computed(() => userStore.avatar_url)
const initials = computed(() => {
  if (!userStore.fullname) return ''
  const names = userStore.fullname.trim().split(' ')
  return names
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

const goToMyAccount = () => {
  router.push('/MyAccount')
}

const handleAvatarError = (e) => {
  e.target.style.display = 'none'
}
</script>

<template>
  <NavigationBar />
  <div class="account-container">
    <MyAccountView />
    <div class="overlay-layout">
      <v-row>
        <v-col cols="12">
          <div class="profile-section d-flex flex-column align-center justify-center pa-6">
            <div class="profile-wrapper">
              <v-card class="pa-6 profile-card" flat>
                <!-- Avatar without decorative elements -->
                <div class="d-flex justify-center mb-4">
                  <!-- Reduced mb-6 to mb-4 -->
                  <v-avatar color="deep-purple lighten-3" size="120" class="avatar-elevated">
                    <!-- Reduced size from 150 to 120 -->
                    <img
                      v-if="avatarUrl"
                      :src="avatarUrl"
                      alt="Avatar"
                      class="avatar-img"
                      @error="handleAvatarError"
                    />
                    <span v-else class="text-h5 white--text">{{ initials }}</span>
                  </v-avatar>
                </div>

                <!-- Compact Profile Info -->
                <div class="compact-profile-info">
                  <div class="form-field">
                    <span class="text-grey-darken-1 field-label">Full Name</span>
                    <v-text-field
                      :model-value="userStore.fullname || 'N/A'"
                      variant="solo"
                      density="compact"
                      readonly
                      class="pa-0 ma-0 profile-field"
                      hide-details
                    />
                  </div>

                  <div class="form-field">
                    <span class="text-grey-darken-1 field-label">Mobile Number</span>
                    <v-text-field
                      :model-value="userStore.mobile || 'N/A'"
                      variant="solo"
                      density="compact"
                      readonly
                      class="pa-0 ma-0 profile-field"
                      hide-details
                    />
                  </div>

                  <div class="form-field">
                    <span class="text-grey-darken-1 field-label">Email</span>
                    <v-text-field
                      :model-value="userStore.email || 'N/A'"
                      variant="solo"
                      density="compact"
                      readonly
                      class="pa-0 ma-0 profile-field"
                      hide-details
                    />
                  </div>
                </div>

                <!-- Action button -->
                <div class="d-flex justify-center mt-6">
                  <!-- Reduced mt-8 to mt-6 -->
                  <v-btn
                    color="#0c3b2e"
                    variant="outlined"
                    @click="goToMyAccount"
                    class="action-btn"
                    size="small"
                  >
                    <v-icon left size="small">mdi-account-edit</v-icon>
                    <!-- Added size small -->
                    Edit Profile
                  </v-btn>
                </div>
              </v-card>
            </div>
          </div>

          <!-- Loading overlay -->
          <v-overlay
            :model-value="formAction.formProcess || isLoadingUser"
            class="align-center justify-center"
          >
            <v-progress-circular indeterminate size="64" color="#0c3b2e"></v-progress-circular>
          </v-overlay>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
/* Base container styles */
.account-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.overlay-layout {
  position: absolute;
  top: 6rem;
  left: 9rem;
  width: 60%;
  height: 60%;
  z-index: 10;
}

/* Profile card adjustments */
.profile-wrapper {
  width: 100%;
  max-width: 500px; /* Reduced from 900px */
  animation: fadeIn 0.5s ease-in-out;
}

.profile-card {
  background-color: rgba(255, 253, 246, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(12, 59, 46, 0.15);
  width: 100%;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(12, 59, 46, 0.1);
  overflow: hidden;
  height: auto; /* Changed from 75vh to auto */
  padding: 24px; /* Reduced from pa-6 (48px) */
}

/* Compact profile info section */
.compact-profile-info {
  display: flex;
  flex-direction: column;
  gap: 6px; /* Tight spacing between fields */
  margin: 0 auto;
  width: 80%; /* Controls width of fields */
}

.form-field {
  width: 100%;
  margin-bottom: 4px; /* Reduced from 8px */
}

.field-label {
  font-size: 0.7rem; /* Slightly smaller */
  color: rgba(0, 0, 0, 0.6);
  margin-left: 4px; /* Reduced from 8px */
  margin-bottom: 1px; /* Very tight */
  display: block;
}

.profile-field {
  background-color: #f5f5f5;
  border-radius: 4px;
}

.profile-field .v-field__outline {
  opacity: 0.3;
}

.profile-field .v-field__input {
  color: rgba(0, 0, 0, 0.87);
  cursor: default;
  padding-top: 2px; /* Reduced from 4px */
  font-size: 0.85rem; /* Slightly smaller text */
}

/* Avatar adjustments */
.avatar-elevated {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 3px solid white;
  transition: transform 0.3s ease;
  width: 120px !important;
  height: 120px !important;
}

.avatar-img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

/* Button adjustments */
.action-btn {
  border-radius: 8px; /* Slightly smaller */
  padding: 0 16px; /* Reduced from 24px */
  height: 36px; /* Reduced from 48px */
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  font-size: 0.8rem; /* Smaller text */
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .overlay-layout {
    left: 5rem;
    width: 70%;
  }

  .compact-profile-info {
    width: 90%;
  }
}

@media (max-width: 600px) {
  .overlay-layout {
    left: 2rem;
    width: 85%;
    top: 4rem;
  }

  .profile-card {
    padding: 16px;
  }

  .compact-profile-info {
    width: 100%;
  }

  .avatar-elevated {
    width: 100px !important;
    height: 100px !important;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
