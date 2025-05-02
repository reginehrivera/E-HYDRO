import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUserStore = defineStore('user', () => {
  const email = ref(localStorage.getItem('email') || '')
  const fullname = ref(localStorage.getItem('fullname') || '')
  const mobile = ref(localStorage.getItem('mobile') || '')
  const avatar_url = ref(localStorage.getItem('avatar_url') || '')

  const setUserData = (userData) => {
    email.value = userData.email
    fullname.value = userData.fullname
    mobile.value = userData.mobile
    avatar_url.value = userData.avatar_url || ''
  }

  // Watch and persist changes
  watch(email, (newVal) => localStorage.setItem('email', newVal))
  watch(fullname, (newVal) => localStorage.setItem('fullname', newVal))
  watch(mobile, (newVal) => localStorage.setItem('mobile', newVal))
  watch(avatar_url, (newVal) => localStorage.setItem('avatar_url', newVal))

  return {
    email,
    fullname,
    mobile,
    avatar_url,
    setUserData,
  }
})
