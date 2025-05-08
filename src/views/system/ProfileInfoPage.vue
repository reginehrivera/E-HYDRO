<script setup>
import { computed, ref } from 'vue' //onMounted
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import ProfileSidebar from '@/components/layout/ProfileSidebar.vue'

const userStore = useUserStore()
const showAvatarModal = ref(false)

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
  <div class="account-container">
    <v-container fluid class="bg-image">
      <div class="overlay-layout">
        <ProfileSidebar />
        <v-row>
          <v-col cols="12">
            <div class="profile-section d-flex flex-column align-center justify-center pa-8">
              <div class="profile-wrapper">
                <v-card class="pa-8 profile-card" flat>
                  <!-- Redesigned layout with avatar on left side -->
                  <div class="d-flex flex-row align-start profile-content">
                    <!-- Left side - Avatar -->
                    <div class="avatar-container mr-6">
                      <v-avatar
                        color="#0a8fe7"
                        size="250"
                        class="avatar-elevated"
                        @click="showAvatarModal = true"
                      >
                        <img
                          v-if="avatarUrl"
                          :src="avatarUrl"
                          alt="Avatar"
                          class="avatar-img"
                          @error="handleAvatarError"
                        />
                        <span v-else class="text-h3 white--text">{{ initials }}</span>
                      </v-avatar>
                    </div>
                    <v-dialog v-model="showAvatarModal" max-width="500">
                      <v-card class="pa-4" style="text-align: center; position: relative">
                        <!-- Close Button -->
                        <v-btn
                          icon
                          @click="showAvatarModal = false"
                          style="position: absolute; top: 10px; right: 10px"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>

                        <!-- Avatar Image or Initials -->
                        <v-avatar size="400" color="#0a8fe7" class="mx-auto avatar-dialog-img">
                          <img
                            v-if="avatarUrl"
                            :src="avatarUrl"
                            alt="Avatar"
                            @error="handleAvatarError"
                          />
                          <span v-else class="text-h3 white--text">{{ initials }}</span>
                        </v-avatar>
                      </v-card>
                    </v-dialog>

                    <!-- Right side - Profile Info -->
                    <div class="profile-info-container">
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
                  </div>

                  <!-- Action button at bottom right -->
                  <div class="d-flex justify-end mt-4">
                    <v-btn
                      color="#0a8fe7"
                      variant="outlined"
                      @click="goToMyAccount"
                      class="action-btn"
                    >
                      <v-icon left>mdi-account-edit</v-icon>
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
    </v-container>
  </div>
</template>

<style scoped>
.bg-image {
  background-image: url('@/assets/img/bg-plain-two.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  position: relative;
  margin-top: 0;
}

/* Base container styles */
.account-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #b5c0c757;
}

.overlay-layout {
  position: absolute;
  top: 5rem;
  left: 15rem;
  width: 80%;
  z-index: 10;
}

/* Profile card adjustments */
.profile-wrapper {
  width: 100%;
  max-width: 700px;
  animation: fadeIn 0.5s ease-in-out;
}

.profile-card {
  background-color: #dee8ef;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(32, 32, 32, 0.267);
  width: 100%;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(12, 59, 46, 0.1);
  overflow: hidden;
  padding: 32px;
}

/* Layout for profile content */
.profile-content {
  display: flex;
  width: 100%;
}

/* Avatar container */
.avatar-container {
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-self: center;
  margin-top: 25px;
}

/* Profile info container */
.profile-info-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Form fields */
.form-field {
  width: 95%;
  margin-bottom: 10px;
  margin-left: 10px;
  padding-top: 15px;
}

.field-label {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
  margin-left: 8px;
  margin-bottom: 2px;
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
  padding-top: 4px;
}

/* Avatar adjustments */
.avatar-elevated {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 3px solid white;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-elevated:hover {
  transform: scale(0.97);
}

.avatar-elevated:active {
  transform: scale(0.93);
}

.avatar-dialog-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.avatar-img {
  object-fit: contain;
  width: 100%;
  height: 100%;
  align-self: center;
}

/* Button adjustments */
.action-btn {
  border-radius: 8px;
  padding: 0 20px;
  height: 40px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}
.action-btn:hover {
  background-color: rgba(12, 38, 59, 0.1);
  color: #0d3a96;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .overlay-layout {
    left: 5rem;
    width: 85%;
  }

  .profile-content {
    flex-direction: column;
    align-items: center;
  }

  .avatar-container {
    margin-right: 0;
    margin-bottom: 24px;
  }

  .profile-info-container {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .overlay-layout {
    left: 2rem;
    width: 90%;
    top: 4rem;
  }

  .profile-card {
    padding: 20px;
  }

  .avatar-elevated {
    width: 200px !important;
    height: 200px !important;
  }
}

@media (max-width: 600px) {
  .overlay-layout {
    left: 1rem;
    width: 95%;
    top: 4rem;
  }

  .avatar-elevated {
    width: 150px !important;
    height: 150px !important;
  }

  .action-btn {
    width: auto;
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

.profile-content {
  flex-direction: row;
}

@media (max-width: 960px) {
  .profile-content {
    flex-direction: column !important;
    align-items: center;
  }

  .profile-card {
    padding: 1.5rem !important;
  }

  .profile-info-container {
    max-width: 400px;
  }

  .avatar-container {
    margin-right: 0 !important;
    margin-bottom: 0.8rem;
    margin-top: -0.8rem;
  }

  .profile-wrapper {
    margin-top: -3rem;
  }
}
</style>
