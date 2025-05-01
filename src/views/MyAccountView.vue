<!-- base layout for MyAccount -->
<template>
  <div class="layout">
    <NavigationBar />
    <main class="content">
      <!--  card  -->

      <v-row class="flex-row-reverse">
        <v-col md="3">
          <v-card class="card-custom-size" hover :style="{ background: '#D9D9D9' }">
            <v-card-item>
              <div class="d-flex mt-5 mb-2">
                <!-- Avatar on the left -->
                <v-avatar color="deep-purple lighten-3" size="90">
                  <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                  <span v-else class="text-h5">{{ initials || '??' }}</span>
                </v-avatar>

                <!-- Right section: name, email, and button -->
                <div class="ms-4 d-flex flex-column justify-start">
                  <span>{{ fullname }}</span>
                  <!-- Displaying full name -->
                  <span>{{ email }}</span>
                  <!-- Displaying email -->
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
                  Edit Profile
                </router-link>
              </div>
              <div style="border-bottom: 1px solid black; padding-bottom: 4px; margin-bottom: 8px">
                <router-link
                  :to="{ name: 'addresses' }"
                  class="link"
                  :class="{ 'v-btn--active': $route.name === 'addresses' }"
                >
                  Delivery Address
                </router-link>
              </div>
              <div style="border-bottom: 1px solid black; padding-bottom: 4px; margin-bottom: 8px">
                <router-link
                  :to="{ name: 'order' }"
                  class="link"
                  :class="{ 'v-btn--active': $route.name === 'order' }"
                >
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
<<<<<<< HEAD
                <div>
                  <v-avatar size="80">
                    <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                    <span v-else class="text-h5">CJ</span>
                  </v-avatar>
=======
                <v-avatar size="90" color="deep-purple lighten-3">
                  <!-- 🎨 Add color here -->
                  <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar-img" />
                  <span v-else class="text-h5 white--text">{{ initials || '??' }}</span>
                  <!-- white text for contrast -->
                </v-avatar>

                <!-- Pencil icon triggers file input -->
                <v-icon @click="triggerFileUpload" style="cursor: pointer"> mdi-pencil </v-icon>
>>>>>>> 2ffcaa2fc1a6450e7d51fa1e2cb0f6dd53d0be1b

                  <!-- Pencil icon triggers file input -->
                  <v-icon class="mt-9" @click="triggerFileUpload" style="cursor: pointer">
                    mdi-pencil
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
              </div>

              <v-form v-model="valid">
                <v-container fluid>
                  <v-row no-gutters>
                    <v-col>
                      <span class="text-grey-darken-1">First Name</span>
                      <v-text-field
                        v-model="firstname"
                        placeholder="Name"
                        variant="solo"
                        density="compact"
                        class="pa-0 ma-1"
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
                      />
                    </v-col>
                  </v-row>

                  <v-row no-gutters>
                    <v-col>
                      <span class="text-grey-darken-1">New Password</span>
                      <v-text-field
                        v-model="newPassword"
                        placeholder="New Password"
                        variant="solo"
                        density="compact"
                        type="password"
                        class="pa-0 ma-1"
                      />
                    </v-col>
                    <v-col>
                      <span class="text-grey-darken-1">Confirm Password</span>
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

                  <v-row justify="center" no-gutters="">
                    <v-col cols="12" sm="8" md="4">
                      <v-btn
                        :style="{ backgroundColor: '#022650', color: 'white' }"
                        rounded="lg"
                        block
                        class="transition-all"
                        @click="saveProfile"
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
            <v-btn
              class="btn text-white w-full sm:w-auto text-sm sm:text-base md:text-lg"
              :style="{ backgroundColor: '#64B5F6' }"
              @click="overlay = !overlay"
            >
              + Add Address
            </v-btn>

            <v-overlay v-model="overlay" class="justify-center align-center" style="top: 10rem">
              <div class="d-flex justify-content-center">
                <v-row>
                  <v-col class="d-flex justify-center pa-0" cols="auto">
                    <v-card ref="form" class="pa-4" style="width: fit-content; max-width: 100%">
                      <v-card-text style="min-width: 360px">
                        <!-- Warning message -->
                        <v-alert v-if="formWarning" type="error">{{ formWarning }}</v-alert>
                        <v-text-field
                          ref="nameRef"
                          v-model="name"
                          :error-messages="nameErrorMessages"
                          :rules="[() => !!name || 'This field is required']"
                          label="Full Name"
                          placeholder="John Doe"
                          required
                        />
                        <v-text-field
                          ref="addressRef"
                          v-model="address"
                          :error-messages="addressErrorMessages"
                          :rules="[() => !!address || 'This field is required']"
                          label="Address Line"
                          placeholder="Snowy Rock Pl"
                          required
                        />
                        <v-text-field
                          ref="cityRef"
                          v-model="city"
                          :error-messages="cityErrorMessages"
                          :rules="[() => !!city || 'This field is required']"
                          label="City"
                          placeholder="El Paso"
                          required
                        />
                        <v-text-field
                          ref="stateRef"
                          v-model="state"
                          :error-messages="stateErrorMessages"
                          :rules="[() => !!state || 'This field is required']"
                          label="State/Province/Region"
                          placeholder="TX"
                          required
                        />
                        <v-text-field
                          ref="zipRef"
                          v-model="zip"
                          :error-messages="zipErrorMessages"
                          :rules="[() => !!zip || 'This field is required']"
                          label="ZIP / Postal Code"
                          placeholder="79938"
                          required
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
                        />
                      </v-card-text>

                      <v-divider class="mt-12" />

                      <v-card-actions>
                        <v-btn variant="text" @click="overlay = false">Cancel</v-btn>
                        <v-spacer />
                        <v-btn color="primary" variant="text" @click="submit">Submit</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-overlay>
          </div>

          <!-- extension address -->

          <container>
            <v-col>
              <span>Address </span>
              <v-divider :color="'black'" :thickness="2"></v-divider>
            </v-col>
            <div class="scrollable-content">
              <div class="flex-container" v-if="submissions.length > 0">
                <v-col
                  v-for="(submission, index) in submissions"
                  :key="index"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-card class="justify-space-between mt-16" variant="none">
                    <v-card-text class="size-card">
                      <!-- Header: address number + delete button -->
                      <div class="d-flex flex-wrap justify-space-between align-center mb-4">
                        <strong>Address {{ index + 1 }}</strong>
                        <v-btn
                          density="comfortable"
                          size="small"
                          color="red"
                          class="tight-text"
                          @click="deleteSubmission(index)"
                        >
                          Delete
                        </v-btn>
                      </div>

                      <!-- Info section: responsive and wrapped properly -->
                      <div class="text-body-2">
                        <span class="mb-1"><strong>Full Name:</strong> {{ submission.name }}</span>
                        <br />
                        <span class="mb-1"><strong>Address:</strong> {{ submission.address }}</span
                        ><br />
                        <span class="mb-1"><strong>City:</strong> {{ submission.city }}</span
                        ><br />
                        <span class="mb-1"><strong>State:</strong> {{ submission.state }}</span
                        ><br />
                        <span class="mb-1"><strong>ZIP Code:</strong> {{ submission.zip }}</span
                        ><br />
                        <span><strong>Country:</strong> {{ submission.country }}</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </div>
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router' // Make sure to import useRouter
import NavigationBar from '@/components/layout/NavigationBar.vue'
import { useUserStore } from '@/stores/user'

// Create an instance of the user store
const userStore = useUserStore()

// Access the fullname and email from the store
const fullname = userStore.fullname
const email = userStore.email
const firstname = ref('')
const lastname = ref('')

const phone = ref('')

const newPassword = ref('')
const confirmPassword = ref('')
const valid = ref(false)

// Handle file upload (for avatar)
const fileInput = ref(null)
function triggerFileUpload() {
  fileInput.value.click()
}
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    avatarUrl.value = URL.createObjectURL(file)
  }
}

// Determine which page section to show based on current route
const route = useRoute()
const isMyAccountPage = computed(() => route.name === 'Myaccount')
const SelectedPage = computed(() => route.name === 'addresses')

// Ref for dialog visibility
const dialogVisible = ref(false)

// Initialize the router
const router = useRouter()

// Function to redirect after clicking the OK button in the dialog
const goToProfilePage = () => {
  dialogVisible.value = false // Close the dialog
  router.push('/profile') // Redirect to the profile page
}

// Save profile logic
function saveProfile() {
  // Combine first and last name
  const updatedFullName = `${firstname.value} ${lastname.value}`

  // Update the fullname, email, and phone number in the Pinia store
  userStore.fullname = updatedFullName
  userStore.mobile = phone.value

  // Optionally, save the avatar URL here if needed
  if (avatarUrl.value) {
    userStore.avatarUrl = avatarUrl.value
  }

  // Save the updated profile data in localStorage
  localStorage.setItem(
    'userProfile',
    JSON.stringify({
      fullname: updatedFullName,
      mobile: phone.value,
      avatarUrl: avatarUrl.value,
    }),
  )

  // Optionally log or perform other actions
  console.log('Profile saved with name:', updatedFullName, 'phone:', phone.value)

  // Open the dialog to show success message
  dialogVisible.value = true
}

const initials = computed(() => {
  if (!userStore.fullname) return ''
  const names = userStore.fullname.trim().split(' ')
  return names
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

const avatarUrl = ref('')

// Update avatarUrl when user data is available
onMounted(() => {
  if (userStore.profilePhoto) {
    avatarUrl.value = userStore.profilePhoto
  }
})

import { onMounted } from 'vue'

// --- Address form logic ---
const overlay = ref(false)
const name = ref('')
const address = ref('')
const city = ref('')
const state = ref('')
const zip = ref('')
const country = ref(null)
const countries = ref(['Philippines', 'United States', 'Canada', 'Australia'])

const nameErrorMessages = ref([])
const addressErrorMessages = ref([])
const cityErrorMessages = ref([])
const stateErrorMessages = ref([])
const zipErrorMessages = ref([])
const countryErrorMessages = ref([])
const formWarning = ref('')

const submissions = ref([])

// Validate and submit address form
function submit() {
  clearErrors()

  if (!name.value) nameErrorMessages.value.push('Full name is required')
  if (!address.value) addressErrorMessages.value.push('Address is required')
  if (!city.value) cityErrorMessages.value.push('City is required')
  if (!state.value) stateErrorMessages.value.push('State is required')
  if (!zip.value) zipErrorMessages.value.push('ZIP code is required')
  if (!country.value) countryErrorMessages.value.push('Country is required')

  if (
    nameErrorMessages.value.length ||
    addressErrorMessages.value.length ||
    cityErrorMessages.value.length ||
    stateErrorMessages.value.length ||
    zipErrorMessages.value.length ||
    countryErrorMessages.value.length
  ) {
    formWarning.value = 'Please complete all required fields.'
    return
  }

  submissions.value.push({
    name: name.value,
    address: address.value,
    city: city.value,
    state: state.value,
    zip: zip.value,
    country: country.value,
  })

  overlay.value = false
  clearForm()
}

function deleteSubmission(index) {
  submissions.value.splice(index, 1)
}

function clearErrors() {
  formWarning.value = ''
  nameErrorMessages.value = []
  addressErrorMessages.value = []
  cityErrorMessages.value = []
  stateErrorMessages.value = []
  zipErrorMessages.value = []
  countryErrorMessages.value = []
}

function clearForm() {
  name.value = ''
  address.value = ''
  city.value = ''
  state.value = ''
  zip.value = ''
  country.value = null
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

</style>
