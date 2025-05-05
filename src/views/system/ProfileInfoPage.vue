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
  <NavigationBar />
  <MyAccountView>
    <div class="account-container">
    <div class="overlay-layout">
      <v-row>
        <v-col cols="12">
          <div class="profile-section pa-6">
            <div class="profile-wrapper">
              <v-card class="profile-card" flat>
                <div class="profile-content">
                  <!-- Avatar Column (Left) -->
                  <div class="avatar-column">
                    <v-avatar
                      color="deep-purple lighten-3"
                      size="160"
                      class="avatar-elevated"
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
                    <v-btn
                      color="#0c3b2e"
                      variant="outlined"
                      @click="goToMyAccount"
                      class="action-btn mt-4"
                    >
                      <v-icon left>mdi-account-edit</v-icon>
                      Edit Profile
                    </v-btn>
                  </div>

                  <!-- Info Column (Right) -->
                  <div class="info-column">
                    <div class="compact-profile-info">
                      <div class="form-field">
                        <span class="text-grey-darken-1 field-label">Full Name</span>
                        <v-text-field
                          :model-value="userStore.fullname || 'N/A'"
                          variant="solo"
                          density="compact"
                          readonly
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

<style scoped>
/* Base container styles */
.account-container {
  position: relative;
  width: 100%;
}

.overlay-layout {
  position: absolute;
  top: -100px;
  left: 9rem;
  width: 60%;
  z-index: 10;
}

/* Profile card layout */
.profile-card {
  background-color: rgba(255, 253, 246, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(12, 59, 46, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(12, 59, 46, 0.1);
  padding: 2rem;
}

.profile-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Avatar column */
.avatar-column {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-elevated {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 3px solid #7E57C2;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.avatar-img {
  object-fit: cover;
}

/* Info column */
.info-column {
  flex-grow: 1;
}

.compact-profile-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.form-field {
  width: 100%;
}

.field-label {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 0.25rem;
}

.action-btn {
  width: 100%;
  max-width: 160px; /* Matches avatar width */
  height: 40px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .overlay-layout {
    left: 5rem;
    width: 70%;
  }

  .profile-content {
    flex-direction: column;
    align-items: center;
  }

  .avatar-column {
    margin-bottom: 1.5rem;
  }

  .action-btn {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .overlay-layout {
    left: 2rem;
    width: 85%;
    top: 4rem;
  }

  .profile-card {
    padding: 1.5rem;
  }

  .avatar-elevated {
    width: 120px !important;
    height: 120px !important;
  }
}
</style>
