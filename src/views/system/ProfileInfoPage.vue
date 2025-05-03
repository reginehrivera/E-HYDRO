<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'

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
import MyAccountView from '@/views/MyAccountView.vue'
</script>

<template>
  <NavigationBar />
  <div class="account-container">
    <MyAccountView />
    <div class="overlay-layout">
      <div>Test Overlay</div>
    </div>
  </div>
</template>

<style scoped>
.account-container {
  position: relative;  /* Required for absolute children */
  width: 100%;
  min-height: 100vh;  /* Ensure container covers the viewport */
}

.overlay-layout {
  position: absolute;  /* Overlay on top of MyAccountView */
  top: 10rem;
  left: 0;
  width:60%;
  height: 50%;
  z-index: 10;  /* Higher than MyAccountView (default: auto) */
  background: rgba(114, 17, 17, 0.3);
}
.profile-wrapper {
  width: 100%;
  max-width: 900px;
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
  right: 15rem;
}

.avatar-elevated {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border: 3px solid white;
  transition: transform 0.3s ease;
}

.avatar-elevated:hover {
  transform: scale(1.05);
}

.avatar-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.field-label {
  font-size: 0.85rem;
  color: #0c3b2e;
  font-weight: 600;
  margin-bottom: 4px;
  opacity: 0.8;
}

.field-value {
  font-size: 1rem;
  padding: 12px;
  background-color: rgba(245, 245, 245, 0.5);
  border-radius: 6px;
  min-height: 45px;
  display: flex;
  align-items: center;
  color: #0c3b2e;
}

.info-card {
  padding: 16px;
  border-radius: 12px !important;
  border-color: rgba(12, 59, 46, 0.1) !important;
  background-color: rgba(255, 255, 255, 0.7) !important;
  transition: all 0.3s ease;
  height: 100%;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(12, 59, 46, 0.1) !important;
}

.action-btn {
  border-radius: 12px;
  padding: 0 24px;
  height: 48px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #0c3b2e !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(12, 59, 46, 0.3);
}

.profile-info {
  animation: slideUp 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

@media (max-width: 600px) {
  .profile-card {
    padding: 24px 16px;
  }
}
</style>
