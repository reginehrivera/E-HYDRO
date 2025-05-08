<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { supabase } from '@/supabase'
import ProfileSidebar from '@/components/layout/ProfileSidebar.vue'
import LoadingPage from '@/components/layout/LoadingPage.vue'
// User data
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

// Profile form data
const email = ref(userStore.email || '')
const firstname = ref('')
const lastname = ref('')
const phone = ref(userStore.mobile || '')
const valid = ref(true)
const newPassword = ref('')
const confirmPassword = ref('')
const dialogVisible = ref(false)
const isSaving = ref(false)

// Avatar upload
const fileInput = ref(null)
const avatarUrl = ref('')
const isUploading = ref(false)
const uploadError = ref('')

// Computed
const isMyAccountPage = computed(() => route.name === 'Myaccount' || route.name === 'profile')
const SelectedPage = computed(() => route.name === 'addresses')

// Address management
const overlay = ref(false)
const address = ref('')
const barangay = ref('')
const city = ref('')
const submissions = ref([])
const newlyAddedIds = ref([])
const isSubmitting = ref(false)
const formWarning = ref('')
const addressErrorMessages = ref([])
const barangayErrorMessages = ref([])
const cityErrorMessages = ref([])

// Methods
const triggerAddAddress = () => {
  overlay.value = true
}

const closeOverlay = () => {
  overlay.value = false
  clearForm()
  clearErrors()
}

const clearForm = () => {
  address.value = ''
  barangay.value = ''
  city.value = ''
}

const clearErrors = () => {
  formWarning.value = ''
  addressErrorMessages.value = []
  barangayErrorMessages.value = []
  cityErrorMessages.value = []
}

const isLoading = ref(true)

onMounted(() => {
  // Simulate loading (3 seconds)
  setTimeout(() => {
    isLoading.value = false
  }, 3000)
})

const submit = async () => {
  clearErrors()

  let isValid = true

  if (!address.value) {
    addressErrorMessages.value = ['Street address is required']
    isValid = false
  }

  if (!barangay.value) {
    barangayErrorMessages.value = ['Barangay is required']
    isValid = false
  }

  if (!city.value) {
    cityErrorMessages.value = ['City is required']
    isValid = false
  }

  if (!isValid) {
    formWarning.value = 'Please fill out all required fields'
    return
  }

  isSubmitting.value = true

  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      throw new Error('User not authenticated')
    }

    const userId = userData.user.id

    // Format the full address for the formatted_address field
    const formattedAddress = `${address.value}, ${barangay.value}, ${city.value}`

    // Insert into addresses table
    const { data: newAddress, error: insertError } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        street_address: address.value,
        barangay: barangay.value,
        city: city.value,
        formatted_address: formattedAddress,
      })
      .select()

    if (insertError) throw insertError

    // Add to local submissions array with the returned database ID
    const addressToAdd = {
      id: newAddress?.[0]?.id || Date.now().toString(),
      address: address.value,
      barangay: barangay.value,
      city: city.value,
      formattedAddress: formattedAddress,
    }

    addSubmission(addressToAdd)

    // Also update the userStore if needed with the primary address
    userStore.address = formattedAddress

    closeOverlay()
  } catch (error) {
    console.error('Error saving address:', error)
    formWarning.value = error.message || 'Failed to save address'
  } finally {
    isSubmitting.value = false
  }
}

const addSubmission = (submission) => {
  const newSubmission = {
    ...submission,
    id: submission.id || Date.now() + Math.random().toString(36).substr(2, 9),
  }

  submissions.value.push(newSubmission)
  newlyAddedIds.value.push(newSubmission.id)
  setTimeout(() => {
    const index = newlyAddedIds.value.indexOf(newSubmission.id)
    if (index !== -1) {
      newlyAddedIds.value.splice(index, 1)
    }
  }, 2000)
}

const deleteSubmission = async (index) => {
  try {
    if (index < 0 || index >= submissions.value.length) {
      console.error('Invalid index for deletion:', index)
      return
    }

    const addressToDelete = submissions.value[index]

    // Set the deleting flag
    // Create a new array with the updated item to maintain reactivity
    submissions.value = submissions.value.map((item, i) =>
      i === index ? { ...item, isDeleting: true } : item,
    )

    setTimeout(async () => {
      try {
        // Delete from database if it has a valid UUID (meaning it's stored in DB)
        if (
          addressToDelete.id &&
          addressToDelete.id.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          )
        ) {
          const { error } = await supabase.from('addresses').delete().eq('id', addressToDelete.id)

          if (error) {
            console.error('Error deleting address from database:', error)
          }
        }

        // Remove from local array
        submissions.value = submissions.value.filter((_, i) => i !== index)
      } catch (err) {
        console.error('Error during deletion timeout:', err)
      }
    }, 300)
  } catch (error) {
    console.error('Error in deleteSubmission:', error)
  }
}

const isNewlyAdded = (submission) => {
  return submission && submission.id && newlyAddedIds.value.includes(submission.id)
}

const fetchAddresses = async () => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      console.error('No authenticated user found')
      return
    }

    const userId = userData.user.id

    // Fetch addresses from the addresses table
    const { data: addressesData, error: addressesError } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (addressesError) {
      console.error('Error fetching addresses:', addressesError)
      return
    }

    console.log('Fetched addresses data:', addressesData) // Debug log

    if (addressesData && addressesData.length > 0) {
      // Map the database fields to the format expected by the UI
      submissions.value = addressesData.map((addr) => ({
        id: addr.id,
        address: addr.street_address,
        barangay: addr.barangay,
        city: addr.city,
        formattedAddress: addr.formatted_address,
      }))

      // Update the userStore with the primary address (most recent one)
      if (addressesData[0]) {
        userStore.address = addressesData[0].formatted_address
      }
    } else {
      submissions.value = []
    }
  } catch (error) {
    console.error('Error in fetchAddresses:', error)
  }
}

// Profile methods
const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  } else {
    console.error('File input element not found')
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  uploadError.value = ''

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Check if bucket exists
    try {
      const { data: bucket } = await supabase.storage.getBucket('avatars')
      if (!bucket) {
        console.warn('Avatar bucket may not exist, attempting upload anyway')
      }
    } catch (bucketError) {
      console.warn('Error checking bucket, attempting upload anyway:', bucketError)
    }

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath)

    avatarUrl.value = publicUrl

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl, updated_at: new Date() })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile with new avatar:', updateError)
    }
  } catch (err) {
    console.error('Image upload failed:', err.message)
    uploadError.value = `Upload failed: ${err.message}`
  } finally {
    isUploading.value = false
  }
}

const restrictNonNumericInput = (e) => {
  const key = e.key
  if (
    !/[0-9]/.test(key) &&
    key !== 'Backspace' &&
    key !== 'Tab' &&
    key !== 'ArrowLeft' &&
    key !== 'ArrowRight'
  ) {
    e.preventDefault()
  }
}

const sanitizePhoneNumber = () => {
  phone.value = phone.value.replace(/\D/g, '')
}

const validateForm = () => {
  if (firstname.value && lastname.value && email.value && phone.value) {
    valid.value = true
  } else {
    valid.value = false
  }
  return valid.value
}

const saveProfile = async () => {
  if (!validateForm()) {
    console.error('Form validation failed')
    return
  }

  isSaving.value = true

  const updatedFullName = `${firstname.value} ${lastname.value}`
  const updatedEmail = email.value
  const updatedPhone = phone.value

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('No authenticated user found:', userError?.message)
      alert('Error: You must be logged in to update your profile')
      return
    }

    if (updatedEmail !== userStore.email) {
      const { error: authError } = await supabase.auth.updateUser({
        email: updatedEmail,
      })

      if (authError) {
        console.error('Error updating email in Auth:', authError.message)
        alert(`Error updating email: ${authError.message}`)
        return
      }
    }

    // Check if profile exists
    const { data: existingProfile, error: profileQueryError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileQueryError && profileQueryError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileQueryError)
    }

    let profileResult

    if (existingProfile) {
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
      profileResult = await supabase.from('profiles').insert({
        id: user.id,
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

    userStore.setUserData({
      fullname: updatedFullName,
      email: updatedEmail,
      mobile: updatedPhone,
      avatar_url: avatarUrl.value || '',
      address: userStore.address,
      userId: user.id,
    })

    dialogVisible.value = true
  } catch (error) {
    console.error('Error updating profile:', error)
    alert(`Error updating profile: ${error.message || 'Unknown error'}`)
  } finally {
    isSaving.value = false
  }
}

const goToProfilePage = () => {
  dialogVisible.value = false
  router.push('/profile')
}

// Lifecycle hooks
onMounted(() => {
  // Fill form data from store
  if (userStore.fullname) {
    const names = userStore.fullname.split(' ')
    firstname.value = names[0] || ''
    lastname.value = names.slice(1).join(' ') || ''
  }

  if (userStore.mobile) {
    phone.value = userStore.mobile
  }

  if (userStore.email) {
    email.value = userStore.email
  }

  if (userStore.avatar_url) {
    avatarUrl.value = userStore.avatar_url
  }

  // Fetch addresses on component mount
  if (SelectedPage.value) {
    fetchAddresses()
  }
})

watch([firstname, lastname, email, phone], () => {
  validateForm()
})

// Re-fetch addresses when route changes to addresses page
watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === 'addresses') {
      fetchAddresses()
    }
  },
)

defineExpose({
  addSubmission,
  deleteSubmission,
  saveProfile,
  submit,
  fetchAddresses,
})
</script>

<template>
  <div class="layout">
    <LoadingPage v-if="isLoading" />
    <v-container fluid class="bg-image">
      <div class="vrow">
        <ProfileSidebar />
        <!-- My Account Section -->
        <v-col cols="12" md="7" class="card-v2 d-flex justify-center" v-if="isMyAccountPage">
          <v-slide-y-transition>
            <v-card
              class="w-100 profile-edit-card"
              max-width="900"
              hover
              elevation="6"
              :style="{ background: '#D9D9D9', height: 'auto' }"
            >
              <span class="text-h5 font-weight-medium d-flex justify-center my-4 profile-title">
                Edit Profile
              </span>

              <div class="d-flex flex-column align-center avatar-section">
                <div class="avatar-wrapper">
                  <v-avatar
                    size="120"
                    color="#0a8fe7"
                    class="profile-avatar"
                    :style="{
                      border: '3px solid #0a8fe7',
                      boxShadow: '0 0 15px rgba(126, 87, 194, 0.5)',
                    }"
                  >
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

                <v-progress-circular
                  v-if="isUploading"
                  indeterminate
                  color="primary"
                  size="24"
                  class="mt-2"
                ></v-progress-circular>

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

              <v-form @submit.prevent="saveProfile" v-model="valid" class="profile-form">
                <v-container fluid>
                  <!-- First Name & Last Name Row -->
                  <v-row no-gutters>
                    <v-col cols="12" sm="6" class="form-field animate-field-1">
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

                  <!-- Email & Phone Row -->
                  <v-row no-gutters>
                    <v-col cols="12" sm="6" class="form-field animate-field-3">
                      <span class="text-grey-darken-1 field-label">Email</span>
                      <v-text-field
                        v-model="email"
                        placeholder="Email"
                        variant="solo"
                        density="compact"
                        class="pa-0 ma-1"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" class="form-field animate-field-4">
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

                  <!-- Password Fields Row -->
                  <v-row no-gutters>
                    <v-col cols="12" sm="6" class="form-field animate-field-5">
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
                    <v-col cols="12" sm="6" class="form-field animate-field-6">
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

                  <!-- Save Button -->
                  <v-row justify="center" no-gutters>
                    <v-col cols="12" sm="8" md="4" class="save-button-container">
                      <v-btn
                        color="#0a8fe7"
                        variant="outlined"
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

        <!-- Address Section -->
        <div class="card-container">
          <v-card
            min-height="500"
            max-width="900"
            hover
            :style="{ background: '#D9D9D9' }"
            v-if="SelectedPage"
            class="shrink"
          >
            <div class="d-flex justify-end">
              <v-btn
                class="btn text-white w-full sm:w-auto text-sm sm:text-base md:text-lg add-button"
                :style="{ backgroundColor: '#64B5F6' }"
                @click="triggerAddAddress"
                v-ripple
              >
                <v-icon class="add-icon mr-1">mdi-plus</v-icon>
                Add Address
              </v-btn>

              <!-- Fixed Address Overlay Dialog -->
              <v-dialog
                v-model="overlay"
                transition="dialog-bottom-transition"
                max-width="450px"
                :retain-focus="false"
              >
                <v-card ref="form" class="pa-4 form-card">
                  <v-card-title class="text-h5 mb-2">
                    Add New Address
                    <v-btn icon class="float-right" @click="closeOverlay">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text>
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
                      label="Street Name, Building, House No."
                      placeholder="1234 Main Street"
                      required
                      variant="outlined"
                      prepend-inner-icon="mdi-map-marker"
                      class="form-field mb-3"
                    />

                    <v-text-field
                      ref="barangayRef"
                      v-model="barangay"
                      :error-messages="barangayErrorMessages"
                      :rules="[() => !!barangay || 'This field is required']"
                      label="Barangay"
                      placeholder="Ampayon"
                      required
                      variant="outlined"
                      prepend-inner-icon="mdi-home"
                      class="form-field mb-3"
                    />

                    <v-text-field
                      ref="cityRef"
                      v-model="city"
                      :error-messages="cityErrorMessages"
                      :rules="[() => !!city || 'This field is required']"
                      label="City"
                      placeholder="Butuan City"
                      required
                      variant="outlined"
                      prepend-inner-icon="mdi-city"
                      class="form-field mb-3"
                    />
                  </v-card-text>

                  <v-divider class="my-3" />

                  <v-card-actions>
                    <v-btn variant="text" @click="closeOverlay" class="cancel-btn">Cancel</v-btn>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      @click="submit"
                      class="submit-btn"
                      :loading="isSubmitting"
                      :disabled="isSubmitting"
                    >
                      Submit
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>

            <v-container>
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
                      :style="{ width: '100%' }"
                      :class="{
                        'animate-pulse': isNewlyAdded(submission),
                        isDeleting: submission.isDeleting,
                      }"
                    >
                      <v-card-text class="card-content mt-14">
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

                        <div class="text-body-2 address-content">
                          <div class="d-flex mb-1 address-line">
                            <v-icon size="small" class="mr-2 info-icon">mdi-home</v-icon>
                            <span><strong>Street Name:</strong> {{ submission.address }}</span>
                          </div>
                          <div class="d-flex mb-1 address-line">
                            <v-icon size="small" class="mr-2 info-icon">mdi-city</v-icon>
                            <span
                              ><strong>Barangay:</strong>
                              {{ submission.barangay || submission.city }}</span
                            >
                          </div>
                          <div class="d-flex address-line">
                            <v-icon size="small" class="mr-2 info-icon">mdi-earth</v-icon>
                            <span><strong>City:</strong> {{ submission.city }}</span>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </transition-group>

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
            </v-container>
          </v-card>
        </div>
      </div>
    </v-container>
  </div>

  <v-dialog v-model="dialogVisible" persistent max-width="400px">
    <v-card>
      <v-card-title class="headline">Profile Updated</v-card-title>
      <v-card-text>Your profile has been updated successfully!</v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="flat" @click="goToProfilePage"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.bg-image {
  background-image: url('@/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  position: relative;
  margin-top: 0;
}
.row {
  margin-left: 2rem;
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

.tight-text {
  letter-spacing: 0;
}
.flex-container {
  display: flex;
  flex-wrap: wrap;
}
.avatar-img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}

.icon-left {
  margin-left: -1rem;
  color: rgb(37, 37, 37);
}

.animated-card {
  transition: all 0.3s ease;
  transform: translateY(20px);
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
  /* right: 3rem; */
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
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.transition-all {
  border-radius: 8px;
  padding: 0 20px;
  height: 40px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}
.transition-all:hover {
  background-color: rgba(12, 38, 59, 0.1);
  color: #0d3a96;
}

/* Component Animations */
.profile-edit-card {
  transform: scale(0.85);
  transform-origin: top center;
  padding: 4px !important;
  max-width: 700px !important;
  max-height: 90vh !important;
  left: 24rem;
  margin-top: 10rem;
}

@media (max-width: 960px) {
  .profile-edit-card {
    max-height: 140vh !important;
    left: 0;
  }
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
  margin-bottom: 16px;
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
  margin-top: 15px;
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
  border-left: 3px solid #0a8fe7;
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
    box-shadow: 0 0 0 0 rgba(8, 73, 170, 0.7);
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
/* .shrink{
  flex-shrink: 1;
} */
.vrow {
  display: flex;
  flex-direction: row;
}
@media (max-width: 1000px) {
  .vrow {
    display: flex;
    flex-wrap: wrap;
  }
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
  border-left: 3px solid #0a8fe7;
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
    box-shadow: 0 0 0 0 rgba(34, 91, 175, 0.7);
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
    box-shadow: 0 0 0 0 rgba(47, 83, 184, 0.7);
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
  box-shadow: 0 0 20px rgba(87, 107, 194, 0.7);
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
  color: #0a8fe7 !important;
  font-weight: 500;
}

.active-link .v-icon {
  color: #0a8fe7 !important;
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
  background: #0a8fe7;
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
.view-profile-btn {
  transition: all 0.3s ease;
  max-width: 120px;
}

.view-profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-container {
  display: flex;
  justify-content: center;
  width: 70%;
  margin-top: 10rem;
  margin-left: 19rem;
}

@media screen and (max-width: 960px) {
  .card-container {
    width: 100%;
    margin-left: 0;
  }
}

/* Apply to your v-card to override existing positioning */
.centered-card {
  position: relative !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  margin: 0 auto; /* Alternative centering method */
  transform: translateY(5rem); /* Another way to move down, can be adjusted */
}

/* If you specifically need to target the card in your code */
.v-card.min-height-500 {
  margin: 0 auto;
  position: relative !important;
  top: 5rem !important; /* Overrides the -5rem in your existing CSS */
}
</style>
