// Pinia store: user.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

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
    // Save to localStorage
    localStorage.setItem('email', email.value)
    localStorage.setItem('fullname', fullname.value)
    localStorage.setItem('mobile', mobile.value)
    localStorage.setItem('avatar_url', avatar_url.value)
  }

  return {
    email,
    fullname,
    mobile,
    avatar_url,
    setUserData,
  }
})
