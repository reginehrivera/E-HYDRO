<!-- base layout for MyAccount -->
<template>
  <div class="layout">
    <NavigationBar />
    <main class="content">
      <v-row class="flex-row-reverse">
        <v-col md="3">
          <v-card hover :style="{ background: '#D9D9D9' }">
            <v-card-item>
              <div class="d-flex mt-5 mb-2">
                <!-- Avatar on the left -->
                <v-avatar color="deep-purple lighten-3" size="90">
                  <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                  <span v-else class="text-h5">{{ initials || '??' }}</span>
                </v-avatar>

                <!-- Right section: name, email, and button -->
                <div class="ms-4 d-flex flex-column justify-start">
                  <span>{{ userStore.fullname }}</span>
                  <span>{{ userStore.email }}</span>
                </div>
              </div>
            </v-card-item>
            <v-card-text>
              <div style="border-bottom: 1px solid black; padding-bottom: 4px; margin-bottom: 8px">
                <router-link
                  :to="{ name: 'Myaccount' }"
                  class="link"
                  :class="{ 'v-btn--active': $route.name === 'Myaccount' }"
                >
                  <v-icon left class="mr-2">mdi-account</v-icon>
                  Edit Profile
                </router-link>
              </div>
              <div style="border-bottom: 1px solid black; padding-bottom: 4px; margin-bottom: 8px">
                <router-link
                  :to="{ name: 'addresses' }"
                  class="link"
                  :class="{ 'v-btn--active': $route.name === 'addresses' }"
                >
                  <v-icon left class="mr-2">mdi-map-marker</v-icon>
                  Delivery Address
                </router-link>
              </div>
              <div style="border-bottom: 1px solid black; padding-bottom: 4px; margin-bottom: 8px">
                <router-link
                  :to="{ name: 'order' }"
                  class="link"
                  :class="{ 'v-btn--active': $route.name === 'order' }"
                >
                  <v-icon left class="mr-2">mdi-cart</v-icon>
                  My Orders
                </router-link>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Left side: Profile Form -->
        <v-col cols="12" md="8" class="card-v2 d-flex justify-center" v-if="isMyAccountPage">
          <v-slide-y-transition>
            <v-card
              class="w-100"
              max-width="900"
              hover
              elevation="6"
              :style="{ background: '#D9D9D9', transition: 'all 0.3s ease' }"
            >
              <span class="text-h5 font-weight-medium d-flex justify-center my-4">
                Edit Profile
              </span>

              <!-- Profile Picture with Upload -->
              <div class="d-flex flex-column align-center">
                <div class="avatar-container">
                  <v-avatar size="90" color="deep-purple lighten-3">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                    <span v-else class="text-h5 white--text">{{ initials || '??' }}</span>
                  </v-avatar>

                  <!-- Pencil icon triggers file input -->
                  <v-icon
                    @click="triggerFileUpload"
                    style="cursor: pointer"
                    class="mt-15 icon-left"
                    :disabled="isUploading"
                  >
                    mdi-square-edit-outline
                  </v-icon>
                </div>

                <!-- Hidden file input -->
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  style="display: none"
                />

                <!-- Upload progress indicator -->
                <v-progress-circular
                  v-if="isUploading"
                  indeterminate
                  color="primary"
                  size="24"
                  class="mt-2"
                ></v-progress-circular>

                <!-- Upload error message -->
                <v-alert
                  v-if="uploadError"
                  type="error"
                  dense
                  class="mt-2"
                  dismissible
                  @click:close="uploadError = ''"
                >
                  {{ uploadError }}
                </v-alert>
              </div>

              <v-form @submit.prevent="saveProfile">
                <v-container fluid>
                  <v-row no-gutters>
                    <v-col>
                      <span class="text-grey-darken-1">First Name</span>
                      <v-text-field
                        v-model="firstname"
                        placeholder="First Name"
                        variant="solo"
                        density="compact"
                        class="pa-0 ma-1"
                        required
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <span class="text-grey-darken-1">Last Name</span>
                      <v-text-field
                        v-model="lastname"
                        placeholder="Last name"
                        variant="solo"
                        density="compact"
                        class="pa-0 ma-1"
                        required
                      />
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col>
                      <span class="text-grey-darken-1">Email</span>
                      <v-text-field
                        v-model="email"
                        placeholder="Email"
                        variant="solo"
                        density="compact"
                        class="pa-0 ma-1"
                        required
                      />
                    </v-col>
                    <v-col>
                      <span class="text-grey-darken-1">Phone Number</span>
                      <v-text-field
                        v-model="phone"
                        placeholder="Phone number"
                        variant="solo"
                        density="compact"
                        class="pa-0 ma-1"
                        type="tel"
                        required
                        @keydown="restrictNonNumericInput"
                        @input="sanitizePhoneNumber"
                      />
                    </v-col>
                  </v-row>

                  <v-row justify="center" no-gutters="" class="mt-4">
                    <v-col cols="12" sm="8" md="4">
                      <v-btn
                        :style="{ backgroundColor: '#022650', color: 'white' }"
                        rounded="lg"
                        block
                        class="transition-all"
                        type="submit"
                        @click="saveProfile"
                        :loading="isSaving"
                        :disabled="isSaving || isUploading"
                      >
                        Save Changes
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-slide-y-transition>
        </v-col>

        <!-- Address section and other content goes here -->
      </v-row>
    </main>
  </div>

  <!-- Success Message Dialog -->
  <v-dialog v-model="dialogVisible" persistent max-width="400px">
    <v-card>
      <v-card-title class="headline">Profile Updated</v-card-title>
      <v-card-text>Your profile has been updated successfully!</v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="goToProfilePage">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/supabase'

// Create an instance of the user store
const userStore = useUserStore()

// Form fields with initialization from store
const email = ref(userStore.email || '')
const firstname = ref('')
const lastname = ref('')
const phone = ref(userStore.mobile || '')
const valid = ref(true) // Set to true by default to enable the button
const dialogVisible = ref(false)
const isSaving = ref(false)

// Avatar upload functionality
const fileInput = ref(null)
const avatarUrl = ref('')
const isUploading = ref(false)
const uploadError = ref('')

// Initialize component data
onMounted(() => {
  console.log(
    'Component mounted, initializing with data:',
    userStore.fullname,
    userStore.email,
    userStore.mobile,
  )

  if (userStore.fullname) {
    const names = userStore.fullname.split(' ')
    firstname.value = names[0] || ''
    lastname.value = names.slice(1).join(' ') || ''
  }

  // Initialize phone from store
  if (userStore.mobile) {
    phone.value = userStore.mobile
  }

  // Initialize email from store
  if (userStore.email) {
    email.value = userStore.email
  }

  // Initialize avatar if available
  if (userStore.avatar_url) {
    avatarUrl.value = userStore.avatar_url
  }
})

// Restrict input to numbers only (on keydown event)
const restrictNonNumericInput = (e) => {
  const key = e.key
  if (
    !/[0-9]/.test(key) &&
    key !== 'Backspace' &&
    key !== 'Tab' &&
    key !== 'ArrowLeft' &&
    key !== 'ArrowRight'
  ) {
    e.preventDefault() // Block the input if it's not a number or allowed key
  }
}

// Validate form fields and update valid state
const validateForm = () => {
  // Simple validation - ensure required fields are not empty
  if (firstname.value && lastname.value && email.value && phone.value) {
    valid.value = true
  } else {
    valid.value = false
  }
  return valid.value
}

// Watch changes to form fields
watch([firstname, lastname, email, phone], () => {
  validateForm()
})

// Sanitize the input to remove any non-numeric characters
const sanitizePhoneNumber = () => {
  phone.value = phone.value.replace(/\D/g, '') // Remove all non-digits
}

// Avatar upload functions

function triggerFileUpload() {
  fileInput.value.click()
}

async function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  uploadError.value = ''

  try {
    // Get current user ID
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // First check if user has storage access - this is crucial
    const { data: bucket } = await supabase.storage.getBucket('avatars')
    if (!bucket) {
      // Create bucket if it doesn't exist (though this should be done by admin)
      console.warn('Avatar bucket may not exist')
    }

    // Upload image to Supabase Storage with correct metadata
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type, // Set the correct content type
    })

    if (uploadError) throw uploadError

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath)

    // Update local display immediately
    avatarUrl.value = publicUrl

    // Update the avatar URL in the profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date() })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile with new avatar:', updateError)
      // Continue anyway as the upload was successful
    }

    console.log('Avatar uploaded and profile updated:', publicUrl)
  } catch (err) {
    console.error('Image upload failed:', err.message)
    uploadError.value = `Upload failed: ${err.message}`
  } finally {
    isUploading.value = false
  }
}
// Determine which page section to show based on current route
const route = useRoute()
const isMyAccountPage = computed(() => route.name === 'Myaccount')

// Initialize the router
const router = useRouter()

// Function to redirect after clicking the OK button in the dialog
const goToProfilePage = () => {
  dialogVisible.value = false // Close the dialog
  router.push('/profile') // Redirect to the profile page
}
// saveProfile function - updated to work with RLS policies
const saveProfile = async () => {
  console.log('Save Profile button clicked')

  // Prevent submission if form is invalid
  if (!validateForm()) {
    console.error('Form validation failed')
    return
  }

  isSaving.value = true

  const updatedFullName = `${firstname.value} ${lastname.value}`
  const updatedEmail = email.value
  const updatedPhone = phone.value

  console.log('Updating profile with:', {
    fullName: updatedFullName,
    email: updatedEmail,
    phone: updatedPhone,
  })

  try {
    // Get current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('No authenticated user found:', userError?.message)
      alert('Error: You must be logged in to update your profile')
      return
    }

    console.log('Current user ID:', user.id)

    // Update email in Auth if needed
    if (updatedEmail !== userStore.email) {
      console.log('Email changed, updating in Auth')
      const { error: authError } = await supabase.auth.updateUser({
        email: updatedEmail,
      })

      if (authError) {
        console.error('Error updating email in Auth:', authError.message)
        alert(`Error updating email: ${authError.message}`)
        return
      }
    }

    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    let profileResult

    if (existingProfile) {
      // Update existing profile
      profileResult = await supabase
        .from('profiles')
        .update({
          full_name: updatedFullName,
          email: updatedEmail,
          contact_number: updatedPhone,
          avatar_url: avatarUrl.value || '',
          updated_at: new Date(),
        })
        .eq('id', user.id)
    } else {
      // Insert new profile
      profileResult = await supabase.from('profiles').insert({
        id: user.id, // This must match auth.uid() for RLS policies
        full_name: updatedFullName,
        email: updatedEmail,
        contact_number: updatedPhone,
        avatar_url: avatarUrl.value || '',
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    const { error: profileError } = profileResult

    if (profileError) {
      console.error('Error updating profile:', profileError)
      alert(`Error updating profile: ${profileError.message}`)
      return
    }

    console.log('Profile update in Supabase successful')

    // Update Pinia store with the new data
    userStore.setUserData({
      fullname: updatedFullName,
      email: updatedEmail,
      mobile: updatedPhone,
      avatar_url: avatarUrl.value || '',
      address: userStore.address, // Keep existing address
      userId: user.id,
    })

    console.log('Profile updated successfully in store!')

    // Show success dialog
    dialogVisible.value = true
  } catch (error) {
    console.error('Error updating profile:', error)
    alert(`Error updating profile: ${error.message || 'Unknown error'}`)
  } finally {
    isSaving.value = false
  }
}
// Computed for initials (avatar fallback)
const initials = computed(() => {
  if (!userStore.fullname) return ''
  const names = userStore.fullname.trim().split(' ')
  return names
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

// For address functionality (existing code)
const overlay = ref(false)
const address = ref('')
const city = ref('')
const country = ref('')
const addressErrorMessages = ref([])
const cityErrorMessages = ref([])
const countryErrorMessages = ref([])
const formWarning = ref('')
const submissions = ref([])
const countries = ['USA', 'Canada', 'Philippines', 'Japan', 'UK', 'Australia'] // Example countries

// Form submission for address
const submit = () => {
  // Add validation as needed
  if (!address.value || !city.value || !country.value) {
    formWarning.value = 'Please fill out all required fields'
    return
  }

  submissions.value.push({
    address: address.value,
    city: city.value,
    country: country.value,
  })

  // Reset form
  address.value = ''
  city.value = ''
  country.value = ''
  formWarning.value = ''
  overlay.value = false
}

// Delete an address
const deleteSubmission = (index) => {
  submissions.value.splice(index, 1)
}
</script>

<style scoped>
.content {
  background-image: url('/src/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 12rem;
}
.row {
  margin-left: 2rem;
}
.spanex {
  margin-left: 1rem;
}
.btn {
  top: 1rem;
  margin-right: 2rem;
  max-width: 250px;
}
.card-v2 {
  top: 150px;
}
.v-card {
  position: relative;
  top: -5rem;
}
.v-container {
  padding: 40px;
  padding-top: 0px;
}
.avatar {
  top: 5rem;
}
.link {
  text-decoration: none;
  color: black;
}
.v-btn--active {
  color: #1565c0 !important;
  font-weight: bold;
}
.SpaceinBetween {
  padding: -20px;
}
.container {
  display: flex;
  justify-content: flex-end; /* Positions the card to the right */
  padding: 20px;
}
.v-cards {
  max-width: 344px; /* Limiting the width */
  height: 20rem;
}

/*spacing in profile */
.vrow {
  padding: 0px;
  margin: 0px;
}
.tight-text {
  letter-spacing: 0;
}
.scrollable-content {
  max-height: 400px; /* Adjust as needed */
  overflow-y: auto;
  margin-top: 16px;
  padding-right: 8px; /* Prevent scrollbar from overlapping content */
  width: 899px;
}
.flex-container {
  display: flex;
  flex-wrap: wrap;
}
.size-card {
  max-width: 200px;
}

.avatar-img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

/* In your style section */
/* .card-custom-size {
  width: 35rem;
} */
.icon-left {
  margin-left: -1rem;
  color: rgb(37, 37, 37);
}

/* address card  */
</style>
