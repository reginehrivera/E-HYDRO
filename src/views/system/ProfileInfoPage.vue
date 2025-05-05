<script setup>
import { computed, ref, onMounted } from 'vue'
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
  <MyAccountView class="flex-container">
    <div class="account-container">
      <div class="overlay-layout">
        <v-row>
          <v-col cols="12">
            <div class="profile-section">
              <div class="profile-wrapper">
                <v-card class="profile-card">
                  <div class="profile-content">
                    <!-- Avatar Column (Left) -->
                    <div class="avatar-column">
                      <v-avatar
                        color="deep-purple lighten-3"
                        :size="avatarSize"
                        class="avatar-elevated"
                      >
                        <img
                          v-if="avatarUrl"
                          :src="avatarUrl"
                          alt="Avatar"
                          class="avatar-img"
                          @error="handleAvatarError"
                        />
                        <span v-else class="avatar-initials">{{ initials }}</span>
                      </v-avatar>
                      <v-btn
                        color="#0c3b2e"
                        variant="outlined"
                        @click="goToMyAccount"
                        class="action-btn"
                      >
                        <v-icon left>mdi-account-edit</v-icon>
                        Edit Profile
                      </v-btn>
                    </div>

                    <!-- Info Column (Right) -->
                    <div class="info-column">
                      <div class="profile-text">
                        <span class="profile-name">{{ userStore.fullname }}</span>
                        <span class="profile-email">
                          <v-icon small class="mr-1">mdi-email</v-icon>
                          {{ userStore.email }}
                        </span>
                      </div>

                      <div class="compact-profile-info">
                        <div class="form-field">
                          <span class="field-label">Mobile Number</span>
                          <v-text-field
                            :model-value="userStore.mobile || 'N/A'"
                            variant="solo"
                            density="compact"
                            readonly
                            hide-details
                          />
                        </div>

                        <div class="form-field">
                          <span class="field-label">Additional Info</span>
                          <v-text-field
                            :model-value="userStore.additionalInfo || 'N/A'"
                            variant="solo"
                            density="compact"
                            readonly
                            hide-details
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </MyAccountView>
</template>

<script>
export default {
  computed: {
    avatarSize() {
      switch (this.$vuetify.display.name) {
        case 'xs': return 100
        case 'sm': return 120
        case 'md': return 140
        default: return 160
      }
    }
  }
}
</script>

<style scoped>
/* Base Layout */
.flex-container {
  display: flex;
  min-height: 100vh;
}

.account-container {
  flex: 1;
  position: relative;
  width: 100%;
}

.overlay-layout {
  position: absolute;
  top: 0px;
  left: 50px;
  width: 60%;
  height: 100%;
  z-index: 10;
}

/* Card Layout */
.profile-card {
  background-color: rgba(255, 253, 246, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(12, 59, 46, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(12, 59, 46, 0.1);
  padding: clamp(1rem, 3vw, 2rem);
}

.profile-content {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(1rem, 3vw, 2rem);
  align-items: flex-start;
}

/* Avatar Column */
.avatar-column {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: min(100%, 200px);
}

.avatar-elevated {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 3px solid #7E57C2;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  width: 100%;
  height: auto;
  aspect-ratio: 1/1;
}

.avatar-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.avatar-initials {
  font-size: clamp(2rem, 10vw, 3rem);
}

/* Info Column */
.info-column {
  flex: 1 1 300px;
  min-width: 0;
}

.profile-text {
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
}

.profile-name {
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  font-weight: bold;
  display: block;
  color: rgba(0, 0, 0, 0.87);
  line-height: 1.3;
}

.profile-email {
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  line-height: 1.4;
}

/* Form Fields */
.compact-profile-info {
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.5vw, 1rem);
}

.form-field {
  width: 100%;
}

.field-label {
  font-size: clamp(0.7rem, 1.2vw, 0.8rem);
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 0.25rem;
  display: block;
}

/* Button */
.action-btn {
  width: 100%;
  max-width: min(100%, 160px);
  height: clamp(36px, 5vw, 40px);
  font-size: clamp(0.75rem, 1.2vw, 0.875rem);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    align-items: center;
  }

  .avatar-column {
    margin-bottom: 1.5rem;
  }

  .profile-text {
    text-align: center;
  }

  .profile-email {
    justify-content: center;
  }

  .info-column {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile-card {
    padding: 1rem;
  }

  .avatar-elevated {
    width: 100px !important;
    height: 100px !important;
  }

  .action-btn {
    max-width: 140px;
  }
}
</style>
