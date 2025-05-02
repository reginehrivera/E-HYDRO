import { supabase } from '@/supabase' // Ensure Supabase is properly initialized and imported

export const state = () => ({
  userId: '', // User ID from Supabase
  fullName: '',
  email: '',
  phone: '',
})

export const mutations = {
  updateUserProfile(state, { full_name, email, phone }) {
    state.fullName = full_name
    state.email = email
    state.phone = phone
  },
}

export const actions = {
  // Fetch user profile from Supabase
  async fetchUserProfile({ commit }) {
    const user = supabase.auth.user() // Get the current user from Supabase authentication
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, phone_number')
        .eq('user_id', user.id) // Match user with their profile
        .single() // Ensure we only get a single profile entry

      if (data) {
        commit('updateUserProfile', {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone_number,
        })
      } else if (error) {
        console.error('Error fetching user profile:', error.message)
      }
    }
  },

  // Update user profile in Supabase
  async updateUserProfile({ commit }, { fullName, email, phone }) {
    const user = supabase.auth.user() // Get the current user from Supabase authentication
    if (user) {
      const { error } = await supabase.from('profiles').upsert({
        // Upsert ensures if profile exists, it will update; if not, it will create
        user_id: user.id,
        full_name: fullName,
        email: email,
        phone_number: phone,
        updated_at: new Date(),
      })

      if (error) {
        console.error('Error updating profile:', error.message)
      } else {
        commit('updateUserProfile', { full_name: fullName, email: email, phone: phone })
        console.log('Profile updated successfully')
      }
    }
  },
}
