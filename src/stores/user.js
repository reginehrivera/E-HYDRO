// stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabase'

export const useUserStore = defineStore('user', () => {
  const userId = ref(localStorage.getItem('userId') || '')
  const email = ref(localStorage.getItem('email') || '')
  const fullname = ref(localStorage.getItem('fullname') || '')
  const mobile = ref(localStorage.getItem('mobile') || '')
  const avatar_url = ref(localStorage.getItem('avatar_url') || '')
  const address = ref(localStorage.getItem('address') || '')

  // Computed property for avatar initials
  const initials = computed(() => {
    if (!fullname.value) return ''
    return fullname.value
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  })

  // Set user data and save to localStorage
  const setUserData = (userData) => {
    email.value = userData.email || ''
    fullname.value = userData.fullname || ''
    mobile.value = userData.mobile || ''
    avatar_url.value = userData.avatar_url || ''
    address.value = userData.address || ''

    if (userData.userId) {
      userId.value = userData.userId
      localStorage.setItem('userId', userId.value)
    }

    // Save to localStorage
    localStorage.setItem('email', email.value)
    localStorage.setItem('fullname', fullname.value)
    localStorage.setItem('mobile', mobile.value)
    localStorage.setItem('avatar_url', avatar_url.value)
    localStorage.setItem('address', address.value)
  }

  // Clear user data on logout
  const clearUserData = () => {
    userId.value = ''
    email.value = ''
    fullname.value = ''
    mobile.value = ''
    avatar_url.value = ''
    address.value = ''

    // Clear from localStorage
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    localStorage.removeItem('fullname')
    localStorage.removeItem('mobile')
    localStorage.removeItem('avatar_url')
    localStorage.removeItem('address')
  }

  // Fetch user profile from Supabase - updated to use 'id' instead of 'user_id'
  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        userId.value = user.id
        localStorage.setItem('userId', user.id)

        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email, contact_number, avatar_url, address')
          .eq('id', user.id) // Use 'id' instead of 'user_id'
          .single()

        if (data) {
          setUserData({
            fullname: data.full_name,
            email: data.email,
            mobile: data.contact_number,
            avatar_url: data.avatar_url,
            address: data.address,
          })
          return true
        } else if (error) {
          console.error('Error fetching user profile:', error.message)

          // If profile doesn't exist, create one
          if (error.code === 'PGRST116') {
            // No rows returned error
            console.log('No profile found, creating one...')

            const { error: insertError } = await supabase.from('profiles').insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || '',
              email: user.email,
              contact_number: '',
              avatar_url: '',
              address: '',
              created_at: new Date(),
              updated_at: new Date(),
            })

            if (insertError) {
              console.error('Error creating profile:', insertError.message)
              return false
            }

            // Set basic user data from auth
            setUserData({
              fullname: user.user_metadata?.full_name || '',
              email: user.email,
              userId: user.id,
            })

            return true
          }

          return false
        }
      }
      return false
    } catch (error) {
      console.error('Error in fetchUserProfile:', error.message)
      return false
    }
  }

  // Update user profile in Supabase - updated to use 'id' instead of 'user_id'
  const updateUserProfile = async (profileData) => {
    try {
      if (!userId.value) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return false
        userId.value = user.id
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.fullname || fullname.value,
          email: profileData.email || email.value,
          contact_number: profileData.mobile || mobile.value,
          avatar_url: profileData.avatar_url || avatar_url.value,
          address: profileData.address || address.value,
          updated_at: new Date(),
        })
        .eq('id', userId.value) // Use 'id' instead of 'user_id'

      if (error) {
        console.error('Error updating profile:', error.message)
        return false
      }

      // Update local store
      setUserData(profileData)
      return true
    } catch (error) {
      console.error('Error in updateUserProfile:', error.message)
      return false
    }
  }

  return {
    userId,
    email,
    fullname,
    mobile,
    avatar_url,
    address,
    initials,
    setUserData,
    clearUserData,
    fetchUserProfile,
    updateUserProfile,
  }
})
