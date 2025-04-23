// stores/user.js
import { defineStore } from 'pinia'
import profileImage from '@/assets/img/profile.png' // use import instead of require

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      name: 'Regine Rivera',
      image: profileImage,
    },
  }),
  actions: {
    setUser(data) {
      // Update properties individually for better reactivity
      this.user.name = data.name
      this.user.image = data.image
    },
    logout() {
      this.user.name = ''
      this.user.image = ''
    },
  },
})
