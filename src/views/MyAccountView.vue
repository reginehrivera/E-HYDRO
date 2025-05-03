<!-- base layout for MyAccount -->
<template>
  <div class="layout">
    <NavigationBar />
    <main class="content">
      <!--  card  -->

      <v-row class="flex-row-reverse justify-space-between" no-gutters style="gap: 5rem">
        <v-col md="3">
          <v-card
            hover
            :style="{
              background: 'linear-gradient(145deg, #f0f0f0, #D9D9D9)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }"
            class="animated-card profile-card"
          >
            <v-card-item class="pa-4">
              <div class="d-flex mt-3 mb-2 profile-content">
                <!-- Avatar with animation and border glow -->
                <v-avatar
                  color="deep-purple lighten-3"
                  size="90"
                  class="avatar-animate"
                  :style="{
                    border: '3px solid #7E57C2',
                    boxShadow: '0 0 15px rgba(126, 87, 194, 0.5)',
                  }"
                >
                  <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                  <span v-else class="text-h5 initials-animate white--text">{{
                    initials || '??'
                  }}</span>
                </v-avatar>

                <!-- Profile info with better typography -->
                <div class="ms-4 d-flex flex-column justify-start profile-info">
                  <span class="profile-name text-h6 font-weight-bold text--primary">
                    {{ userStore.fullname }}
                  </span>
                  <span class="profile-email text-caption text--secondary mt-1">
                    <v-icon small class="mr-1">mdi-email</v-icon>
                    {{ userStore.email }}
                  </span>
                </div>
              </div>
            </v-card-item>

            <!-- Links with improved styling -->
            <v-card-text class="pt-0 pb-4">
              <v-divider class="mb-3"></v-divider>
              <div
                v-for="(link, index) in profileLinks"
                :key="link.route"
                class="link-item"
                :style="{
                  animationDelay: `${0.2 + index * 0.1}s`,
                }"
              >
                <router-link
                  :to="{ name: link.route }"
                  class="link d-flex align-center"
                  :class="{ 'active-link': $route.name === link.route }"
                >
                  <v-icon small class="mr-2">{{ getLinkIcon(link.route) }}</v-icon>
                  <span>{{ link.text }}</span>
                  <v-spacer />
                  <v-icon small>mdi-chevron-right</v-icon>
                </router-link>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Left side: Profile Form -->
        <v-col cols="12" md="8" class="card-v2 d-flex justify-center" v-if="isMyAccountPage">
          <v-slide-y-transition>
            <v-card
              class="w-100 profile-edit-card"
              max-width="900"
              hover
              elevation="6"
              :style="{ background: '#D9D9D9' }"
            >
              <!-- Animated title -->
              <span class="text-h5 font-weight-medium d-flex justify-center my-4 profile-title">
                Edit Profile
              </span>

              <!-- Profile Picture with Upload Animation -->
              <div class="d-flex flex-column align-center avatar-section">
                <div class="avatar-wrapper">
                  <v-avatar size="90" color="deep-purple lighten-3" class="profile-avatar">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                    <span v-else class="text-h5 white--text initials">{{ initials || '??' }}</span>
                  </v-avatar>

                  <v-icon
                    @click="triggerFileUpload"
                    style="cursor: pointer"
                    class="mt-15 icon-left"
                    :disabled="isUploading"
                  >
                    mdi-square-edit-outline
                  </v-icon>
                </div>
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

              <!-- Form with staggered field animations -->
              <v-form @submit.prevent="saveProfile" v-model="valid" class="profile-form">
                <v-container fluid>
                  <!-- Name Fields -->
                  <v-row no-gutters>
                    <v-col class="form-field animate-field-1">
                      <span class="text-grey-darken-1 field-label">First Name</span>
                      <v-text-field
                        v-model="firstname"
                        placeholder="Name"
                        variant="solo"
                        density="compact"
                        class="pa-0 ma-1"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" class="form-field animate-field-2">
                      <span class="text-grey-darken-1 field-label">Last Name</span>
                      <v-text-field
                        v-model="lastname"
                        placeholder="Last name"
                        variant="solo"
                        density="compact"
                        class="pa-0 ma-1"
                      />
                    </v-col>
                  </v-row>

                  <!-- Contact Fields -->
                  <v-row no-gutters>
                    <v-col class="form-field animate-field-3">
                      <span class="text-grey-darken-1 field-label">Email</span>
                      <v-text-field
                        v-model="email"
                        placeholder="Email"
                        variant="solo"
                        density="compact"
                        class="pa-0 ma-1"
                      />
                    </v-col>
                    <v-col class="form-field animate-field-4">
                      <span class="text-grey-darken-1 field-label">Phone Number</span>
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

                  <!-- Password Fields -->
                  <v-row no-gutters>
                    <v-col class="form-field animate-field-5">
                      <span class="text-grey-darken-1 field-label">New Password</span>
                      <v-text-field
                        v-model="newPassword"
                        placeholder="New Password"
                        variant="solo"
                        density="compact"
                        type="password"
                        class="pa-0 ma-1"
                      />
                    </v-col>
                    <v-col class="form-field animate-field-6">
                      <span class="text-grey-darken-1 field-label">Confirm Password</span>
                      <v-text-field
                        v-model="confirmPassword"
                        placeholder="Confirm Password"
                        variant="solo"
                        density="compact"
                        type="password"
                        class="pa-0 ma-1"
                      />
                    </v-col>
                  </v-row>

                  <!-- Save Button with Animation -->
                  <v-row justify="center" no-gutters>
                    <v-col cols="12" sm="8" md="4" class="save-button-container">
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
        <!-- Extension for addresses -->

        <v-card
          class="v-cardv2"
          min-height="500"
          max-width="900"
          hover
          :style="{ background: '#D9D9D9' }"
          v-if="SelectedPage"
        >
          <div class="d-flex justify-end">
            <!-- Animated Add button -->
            <v-btn
              class="btn text-white w-full sm:w-auto text-sm sm:text-base md:text-lg add-button"
              :style="{ backgroundColor: '#64B5F6' }"
              @click="triggerAddAddress"
              v-ripple
            >
              <v-icon class="add-icon mr-1">mdi-plus</v-icon>
              Add Address
            </v-btn>

            <!-- Improved overlay animation -->
            <v-dialog
              v-model="overlay"
              transition="dialog-bottom-transition"
              max-width="500px"
              :retain-focus="false"
            >
              <v-card ref="form" class="pa-4 form-card">
                <v-card-title class="text-h5 mb-2">
                  Add New Address
                  <v-btn icon class="float-right" @click="overlay = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>

                <v-card-text>
                  <!-- Warning message with animation -->
                  <v-expand-transition>
                    <v-alert v-if="formWarning" type="error" variant="tonal" class="mb-4">
                      {{ formWarning }}
                    </v-alert>
                  </v-expand-transition>

                  <v-text-field
                    ref="addressRef"
                    v-model="address"
                    :error-messages="addressErrorMessages"
                    :rules="[() => !!address || 'This field is required']"
                    label="Address Line"
                    placeholder="1234 Main Street"
                    required
                    variant="outlined"
                    prepend-inner-icon="mdi-map-marker"
                    class="form-field"
                  />

                  <v-text-field
                    ref="cityRef"
                    v-model="city"
                    :error-messages="cityErrorMessages"
                    :rules="[() => !!city || 'This field is required']"
                    label="City"
                    placeholder="Butuan"
                    required
                    variant="outlined"
                    prepend-inner-icon="mdi-city"
                    class="form-field"
                  />

                  <v-autocomplete
                    ref="countryRef"
                    v-model="country"
                    :items="countries"
                    :error-messages="countryErrorMessages"
                    :rules="[() => !!country || 'This field is required']"
                    label="Country"
                    placeholder="Select..."
                    required
                    variant="outlined"
                    prepend-inner-icon="mdi-earth"
                    class="form-field"
                  />
                </v-card-text>

                <v-divider class="my-3" />

                <v-card-actions>
                  <v-btn variant="text" @click="overlay = false" class="cancel-btn">Cancel</v-btn>
                  <v-spacer />
                  <v-btn color="primary" @click="submit" class="submit-btn" :loading="isSubmitting">
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>

          <!-- Address Section -->
          <container>
            <v-col>
              <div class="d-flex align-center section-header">
                <v-icon class="mr-2">mdi-map-marker-multiple</v-icon>
                <span class="text-h6">My Addresses</span>
              </div>
              <v-divider :color="'black'" :thickness="2" class="mb-4"></v-divider>
            </v-col>

            <div class="scrollable-content">
              <transition-group name="address-list" tag="div" class="flex-container">
                <v-col
                  v-for="(submission, index) in submissions"
                  :key="submission.id || index"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  class="address-item"
                >
                  <v-card
                    class="address-card"
                    variant="outlined"
                    v-ripple
                    elevation="2"
                    :class="{
                      'animate-pulse': isNewlyAdded(submission),
                      isDeleting: submission.isDeleting,
                    }"
                  >
                    <v-card-text class="card-content mt-14">
                      <!-- Header with badge -->
                      <div class="card-header">
                        <div class="d-flex align-center">
                          <v-badge
                            color="deep-purple"
                            :content="index + 1"
                            inline
                            class="mr-2"
                          ></v-badge>
                          <strong class="address-title">Address</strong>
                        </div>
                        <v-btn
                          density="comfortable"
                          size="small"
                          color="red"
                          variant="tonal"
                          class="delete-btn"
                          @click.stop="deleteSubmission(index)"
                        >
                          <v-icon class="mr-1 delete-icon">mdi-delete</v-icon>
                          <span class="btn-text">Delete</span>
                        </v-btn>
                      </div>

                      <!-- Info section with icons -->
                      <div class="text-body-2 address-content">
                        <div class="d-flex mb-1 address-line">
                          <v-icon size="small" class="mr-2 info-icon">mdi-home</v-icon>
                          <span><strong>Address:</strong> {{ submission.address }}</span>
                        </div>
                        <div class="d-flex mb-1 address-line">
                          <v-icon size="small" class="mr-2 info-icon">mdi-city</v-icon>
                          <span><strong>City:</strong> {{ submission.city }}</span>
                        </div>
                        <div class="d-flex address-line">
                          <v-icon size="small" class="mr-2 info-icon">mdi-earth</v-icon>
                          <span><strong>Country:</strong> {{ submission.country }}</span>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </transition-group>

              <!-- Empty state message -->
              <v-fade-transition>
                <div v-if="submissions.length === 0" class="empty-state text-center pa-6">
                  <v-icon size="64" color="grey" class="mb-2">mdi-map-marker-off</v-icon>
                  <p class="text-body-1">No addresses added yet</p>
                  <v-btn
                    color="primary"
                    variant="text"
                    class="mt-3 empty-add-btn"
                    @click="triggerAddAddress"
                  >
                    Add your first address
                  </v-btn>
                </div>
              </v-fade-transition>
            </div>
          </container>
        </v-card>
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

// Mock for demonstration - use your actual state and methods
const isSubmitting = ref(false)

// Add a method to handle the button animation
const triggerAddAddress = () => {
  overlay.value = !overlay.value
}

// Initialize stores, router and route
const userStore = useUserStore()

// Page navigation and routing
const profileLinks = [
  { route: 'Myaccount', text: 'Edit Profile' },
  { route: 'addresses', text: 'Delivery Address' },
  { route: 'order', text: 'My Orders' },
]

const SelectedPage = computed(() => route.name === 'addresses')

// User profile data
// Form fields with initialization from store
const email = ref(userStore.email || '')
const firstname = ref('')
const lastname = ref('')
const phone = ref(userStore.mobile || '')
const valid = ref(true)
const newPassword = ref('')
const confirmPassword = ref('')
const dialogVisible = ref(false)
const isSaving = ref(false)

// Avatar upload functionality
const fileInput = ref(null)
const avatarUrl = ref('')
const isUploading = ref(false)
const uploadError = ref('')

const initials = computed(() => {
  if (!userStore.fullname) return ''
  const names = userStore.fullname.trim().split(' ')
  return names
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

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

// Address management
const overlay = ref(false)
const name = ref('')
const address = ref('')
const city = ref('')
const state = ref('')
const zip = ref('')
const country = ref(null)
const countries = ref(['Philippines', 'United States', 'Canada', 'Australia'])
const submissions = ref([])
const newlyAddedIds = ref([])

// Form validation
const nameErrorMessages = ref([])
const addressErrorMessages = ref([])
const cityErrorMessages = ref([])
const stateErrorMessages = ref([])
const zipErrorMessages = ref([])
const countryErrorMessages = ref([])
const formWarning = ref('')

// ===== METHODS =====

const handleAvatarLoad = () => {
  // Optional: Add any avatar load handling
}

// Address form methods
function clearErrors() {
  formWarning.value = ''
  addressErrorMessages.value = []
  cityErrorMessages.value = []
  countryErrorMessages.value = []
}

function clearForm() {
  address.value = ''
  city.value = ''
  country.value = null
}

function submit() {
  clearErrors()

  if (!address.value) addressErrorMessages.value.push('Address is required')
  if (!city.value) cityErrorMessages.value.push('City is required')
  if (!country.value) countryErrorMessages.value.push('Country is required')

  if (
    addressErrorMessages.value.length ||
    cityErrorMessages.value.length ||
    countryErrorMessages.value.length
  ) {
    formWarning.value = 'Please complete all required fields.'
    return
  }

  // Create new submission with unique ID
  const newSubmission = {
    id: Date.now() + Math.random().toString(36).substring(2, 9),
    address: address.value,
    city: city.value,
    country: country.value,
  }

  // Use the enhanced addSubmission method
  addSubmission(newSubmission)

  overlay.value = false
  clearForm()
}

// Enhanced animation methods
const deleteSubmission = (index) => {
  // Add exit animation class
  submissions.value[index].isDeleting = true

  // Use setTimeout to allow animation to complete
  setTimeout(() => {
    submissions.value.splice(index, 1)
  }, 300)
}

const addSubmission = (submission) => {
  // Add a unique ID if not present
  const newSubmission = {
    ...submission,
    id: submission.id || Date.now() + Math.random().toString(36).substr(2, 9),
  }

  submissions.value.push(newSubmission)

  // Track as newly added for animation
  newlyAddedIds.value.push(newSubmission.id)
  setTimeout(() => {
    const index = newlyAddedIds.value.indexOf(newSubmission.id)
    if (index !== -1) {
      newlyAddedIds.value.splice(index, 1)
    }
  }, 2000) // Remove from "newly added" after 2 seconds
}

const isNewlyAdded = (submission) => {
  return submission.id && newlyAddedIds.value.includes(submission.id)
}

// Lifecycle hooks
onMounted(() => {
  // Initialize data from userStore
  if (userStore.fullname) {
    const names = userStore.fullname.split(' ')
    firstname.value = names[0] || ''
    lastname.value = names.slice(1).join(' ') || ''
  }

  if (userStore.mobile) {
    phone.value = userStore.mobile
  }

  if (userStore.profilePhoto) {
    avatarUrl.value = userStore.profilePhoto
  }

  // Load saved addresses if available
  const savedAddresses = localStorage.getItem('userAddresses')
  if (savedAddresses) {
    submissions.value = JSON.parse(savedAddresses)
  }
})
const getLinkIcon = (route) => {
  const icons = {
    Myaccount: 'mdi-account-cog',
    addresses: 'mdi-map-marker',
    order: 'mdi-package-variant',
  }
  return icons[route] || 'mdi-link'
}

// Expose methods to parent components if needed
defineExpose({
  addSubmission,
  deleteSubmission,
  saveProfile,
  submit,
})
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

/* Animation Classes */
.animated-card {
  transition: all 0.3s ease;
  transform: translateY(20px);
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
  right: 3rem;
}

.profile-content {
  opacity: 0;
  animation: fadeIn 0.4s ease forwards 0.2s;
}

.avatar-animate {
  transition: all 0.3s ease;
  transform: scale(0.95);
  animation: scaleIn 0.5s ease forwards 0.3s;
}

.initials-animate {
  display: inline-block;
  animation: bounceIn 0.6s ease forwards;
}

.profile-info {
  opacity: 0;
  transform: translateX(-10px);
  animation: fadeInRight 0.4s ease forwards 0.4s;
}

.profile-name {
  display: inline-block;
  animation: fadeInUp 0.3s ease forwards 0.5s;
}

.profile-email {
  display: inline-block;
  animation: fadeInUp 0.3s ease forwards 0.6s;
}

.link-item {
  opacity: 0;
  transform: translateX(-10px);
  animation: fadeInRight 0.4s ease forwards;
}

.link {
  transition: all 0.2s ease;
  display: inline-block;
}

.link:hover {
  transform: translateX(5px);
  color: #1565c0;
}

.v-btn--active {
  color: #1565c0 !important;
  font-weight: bold;
  position: relative;
}

.v-btn--active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #1565c0;
  animation: underlineGrow 0.3s ease forwards;
}

/* Keyframe Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes underlineGrow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Base Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Component Animations */
.profile-edit-card {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease-out forwards;
}

.profile-title {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards 0.2s;
}

.avatar-section {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards 0.3s;
}

.profile-avatar {
  transition: all 0.3s ease;
  transform: scale(0.95);
  animation: scaleIn 0.5s ease-out forwards 0.4s;
}

.profile-avatar:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.initials {
  display: inline-block;
  animation: pulse 1s ease-in-out;
}

.edit-icon {
  transition: all 0.3s ease;
  cursor: pointer;
  animation: fadeIn 0.5s ease-out forwards 0.5s;
}

.edit-icon:hover {
  transform: scale(1.2);
  color: #1565c0;
}

.profile-form {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards 0.4s;
}

.form-field {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.4s ease-out forwards;
}

.animate-field-1 {
  animation-delay: 0.5s;
}
.animate-field-2 {
  animation-delay: 0.6s;
}
.animate-field-3 {
  animation-delay: 0.7s;
}
.animate-field-4 {
  animation-delay: 0.8s;
}
.animate-field-5 {
  animation-delay: 0.9s;
}
.animate-field-6 {
  animation-delay: 1s;
}

.field-label {
  display: inline-block;
  transition: all 0.3s ease;
}

.field-label:hover {
  color: #1565c0;
  transform: translateX(5px);
}

.save-button-container {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards 1.1s;
}

.save-button {
  transition: all 0.3s ease;
}

.save-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .form-field {
    animation-delay: 0s !important;
    animation-duration: 0.3s;
  }
}

scrollable-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0 8px;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
}

.address-card {
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  overflow: visible !important;
}

.address-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  border-left: 3px solid #673ab7;
}

.delete-btn {
  opacity: 0.8;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.05);
}

.address-content {
  transition: all 0.2s ease;
}

/* Entry/exit animations for list items */
.address-list-enter-active {
  transition: all 0.5s ease;
}

.address-list-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}

.address-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.address-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Pulse animation for newly added items */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(103, 58, 183, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(103, 58, 183, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(103, 58, 183, 0);
  }
}

.animate-pulse {
  animation: pulse 1.5s infinite;
  background-color: rgba(103, 58, 183, 0.1);
}

/* Make delete animation smooth */
.isDeleting {
  transition: all 0.3s;
  transform: scale(0.9);
  opacity: 0;
}

.scrollable-content {
  max-height: 400px; /* Adjust as needed */
  overflow-y: auto !important;
  margin-top: 16px;
  padding-right: 8px; /* Prevent scrollbar from overlapping content */
  width: 899px;
}
.scrollable-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0 8px;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
}

.section-header {
  animation: slideInFromLeft 0.5s ease-out;
}

/* Card styling and animations */
.address-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-left: 3px solid transparent;
  overflow: hidden;
  background-color: white !important;
}

.address-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15) !important;
  border-left: 3px solid #673ab7;
}

/* Button container - ensures it never gets squeezed */
.delete-btn {
  opacity: 0.9;
  transition: all 0.2s ease;
  background-color: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);

  flex-shrink: 0 !important;
  min-width: max-content !important;
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

/* Hover effects (keep your nice animations) */
.delete-btn:hover {
  opacity: 1;
  transform: scale(1.05);
  background-color: rgba(244, 67, 54, 0.2);
}

/* Icon animation (unchanged) */
.delete-icon {
  transition: all 0.3s ease;
}

.delete-btn:hover .delete-icon {
  transform: rotate(20deg);
}
.add-button {
  transition: all 0.3s ease;
  overflow: hidden;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.add-icon {
  transition: all 0.3s ease;
}

.add-button:hover .add-icon {
  transform: rotate(90deg);
}

/* Form animations */
.form-card {
  animation: slideDown 0.3s ease-out;
}

.form-field {
  transition: all 0.3s ease;
}

.form-field:focus-within {
  transform: scale(1.02);
}

.submit-btn,
.cancel-btn {
  transition: all 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

/* Info content animations */
.address-content {
  transition: all 0.2s ease;
}

.info-icon {
  transition: all 0.3s ease;
  opacity: 0.7;
}

.address-card:hover .info-icon {
  opacity: 1;
  transform: scale(1.2);
}

/* Empty state animations */
.empty-state {
  animation: fadeIn 1s ease;
}

.empty-add-btn {
  animation: pulse 2s infinite;
}

/* Entry/exit animations for list items */
.address-list-enter-active {
  animation: slideInRight 0.5s;
}

.address-list-leave-active {
  position: absolute;
  animation: fadeOutLeft 0.3s;
}

.address-list-move {
  transition: transform 0.5s;
}

/* Pulse animation for newly added items */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(103, 58, 183, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(103, 58, 183, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(103, 58, 183, 0);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50px);
    opacity: 0;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromLeft {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Make delete animation smooth */
.isDeleting {
  animation: fadeOutLeft 0.3s;
  transition: all 0.3s;
  transform: translateX(-30px);
  opacity: 0;
}

.animate-pulse {
  animation: pulse 1.5s infinite;
  background-color: rgba(103, 58, 183, 0.1);
}

/* Base styles */
.scrollable-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0 8px;
}

.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.address-card {
  height: 100%;
  transition: all 0.3s ease;
  position: relative;
}

.card-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.address-content {
  flex-grow: 1;
}

.address-line {
  word-break: break-word;
}

.delete-btn {
  flex-shrink: 0;
  white-space: nowrap;
}

/* Responsive adjustments */
/* Mobile (xs) */
@media (max-width: 599px) {
  .address-item {
    padding: 8px 0;
  }

  .address-card {
    min-width: 100%;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .address-title {
    margin-bottom: 8px;
  }
}

/* Small devices (sm) */
@media (min-width: 600px) and (max-width: 959px) {
  .address-item {
    flex: 0 0 calc(50% - 8px);
    max-width: calc(50% - 8px);
  }
}

/* Medium devices (md) */
@media (min-width: 960px) and (max-width: 1263px) {
  .address-item {
    flex: 0 0 calc(33.333% - 11px);
    max-width: calc(33.333% - 11px);
  }
}

/* Large devices (lg) */
@media (min-width: 1264px) {
  .address-item {
    flex: 0 0 calc(25% - 12px);
    max-width: calc(25% - 12px);
  }
}

/* Animation styles */
.address-list-enter-active,
.address-list-leave-active {
  transition: all 0.5s ease;
}

.address-list-enter-from,
.address-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.address-list-move {
  transition: transform 0.5s;
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}

.isDeleting {
  transition: all 0.3s;
  transform: scale(0.9);
  opacity: 0;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(103, 58, 183, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(103, 58, 183, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(103, 58, 183, 0);
  }
}

/* Card styling */
.profile-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
}

/* Avatar animation */
.avatar-animate {
  transition: all 0.4s ease;
}

.profile-card:hover .avatar-animate {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(126, 87, 194, 0.7);
}

/* Link styling */
.link {
  text-decoration: none;
  color: #424242;
  padding: 10px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  margin: 2px 0;
}

.link:hover {
  background: rgba(126, 87, 194, 0.08);
  transform: translateX(4px);
}

.active-link {
  background: rgba(126, 87, 194, 0.1) !important;
  color: #673ab7 !important;
  font-weight: 500;
}

.active-link .v-icon {
  color: #673ab7 !important;
}

/* Profile name animation */
.profile-name {
  position: relative;
  display: inline-block;
}

.profile-name::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #7e57c2;
  transition: width 0.3s ease;
}

.profile-card:hover .profile-name::after {
  width: 100%;
}

/* Link items animation */
.link-item {
  opacity: 0;
  animation: fadeInUp 0.5s forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
