<!-- base layout for MyAccount -->
<template>
  <div class="layout">
    <NavigationBar />
    <main class="content">
      <!--  card  -->

      <v-row class="flex-row-reverse">
        <v-col md="3">
          <v-card
            class="card_permanent"
            max-width="auto"
            max-height="20rem"
            hover
            :style="{ background: '#D9D9D9' }"
          >
            <v-card-item>
              <div class="d-flex mt-5 mb-2">
                <!-- Avatar on the left -->
                <v-avatar color="surface-variant" size="90">
                  <span class="text-h5">CJ</span>
                </v-avatar>

                <!-- Right section: name, email, and button -->
                <div class="ms-4 d-flex flex-column justify-start">
                  <span>John Doe</span>
                  <span>John@gmail.com</span>
                  <v-btn
                    size="small"
                    :style="{ background: '#07ACAF', color: 'white' }"
                    class="mt-2 align-self-start"
                  >
                    Edit Profile
                  </v-btn>
                </div>
              </div>
            </v-card-item>
            <v-card-text>
              <div style="border-bottom: 1px solid black; padding-bottom: 4px; margin-bottom: 8px">
                <router-link
                  :to="{ name: 'order' }"
                  class="link"
                  :class="{ 'v-btn--active': $route.name === 'order' }"
                >
                  My Orders
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
                  :to="{ name: 'Myaccount' }"
                  class="link"
                  :class="{ 'v-btn--active': $route.name === 'Myaccount' }"
                >
                  Profile Settings
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
                Profile Settings
              </span>

              <div class="d-flex justify-center">
                <v-avatar color="red" size="80">
                  <span class="text-h5">CJ</span>
                </v-avatar>
              </div>

              <div class="d-flex justify-center">John Doe</div>
              <div class="d-flex justify-center">JohnDoe@gmail.com</div>

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
                        :rules="nameRules"
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
                        :rules="lastNameRules"
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
                        :rules="emailRules"
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
                        :rules="phoneRules"
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
                        :rules="passwordRules"
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
                        :rules="confirmPasswordRules"
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
              min-width="900"
              hover
              :style="{ background: '#D9D9D9' }"
              v-if="SelectedPage"
            >
            <div class="d-flex justify-end">
                <v-btn class="btn" :style="{ background: '#64B5F6' }" @click="overlay = !overlay">
                  + Add Address
                </v-btn>
                <v-overlay v-model="overlay" class="justify-center align-center" style="top: 10rem">
                  <div class="d-flex justify-content-center">
                    <v-row>
                      <v-col class="d-flex justify-center pa-0" cols="auto">
                        <v-card ref="form" class="pa-4" style="width: fit-content; max-width: 100%">
                          <v-card-text style="min-width: 360px">
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
              <v-container>
                <span>Address </span>
                <v-divider :color="'black'" :thickness="2"></v-divider>
                <v-container>
                  <v-row class="mt-7" v-if="submissions.length > 0">
                    <v-col
                      v-for="(submission, index) in submissions"
                      :key="index"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-card class="d-flex flex-column justify-space-between mt-16" variant="none">
                        <v-card-text>
                          <div class="d-flex justify-space-between align-center mb-2">
                            <strong>address {{ index + 1 }}</strong>
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
                          <div><strong>Full Name:</strong> {{ submission.name }}</div>
                          <div><strong>Address:</strong> {{ submission.address }}</div>
                          <div><strong>City:</strong> {{ submission.city }}</div>
                          <div><strong>State:</strong> {{ submission.state }}</div>
                          <div><strong>ZIP Code:</strong> {{ submission.zip }}</div>
                          <div><strong>Country:</strong> {{ submission.country }}</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-container>
            </v-card>


      </v-row>
    </main>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'
const SelectedPage = computed(() => route.name === 'addresses')
const route = useRoute()

// Form fields
const valid = ref(false)
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const phone = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Validation Rules
const nameRules = [
  (v) => !!v || 'Name is required.',
  (v) => v.length <= 10 || 'Name must be less than 10 characters.',
]

const lastNameRules = [
  (v) => !!v || 'Last name is required.',
  (v) => v.length <= 10 || 'Last name must be less than 10 characters.',
]

const emailRules = [
  (v) => !!v || 'E-mail is required.',
  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
]

const phoneRules = [
  (v) => !!v || 'Phone number is required.',
  (v) => /^\d{10,15}$/.test(v) || 'Phone number must be valid (10–15 digits).',
]

const passwordRules = [
  (v) => !!v || 'New password is required.',
  (v) => v.length >= 6 || 'Password must be at least 6 characters.',
]

const confirmPasswordRules = computed(() => [
  (v) => !!v || 'Confirmation password is required.',
  (v) => v === newPassword.value || 'Passwords do not match.',
])
// Route-based check
const isMyAccountPage = computed(() => route.name === 'Myaccount')
//overlay

const overlay = ref(false)

watch(overlay, (val) => {
  if (val) {
    setTimeout(() => {
      overlay.value = true
    })
  }
})

const countries = ['Philippines']
// Form values
const name = ref('')
const address = ref('')
const city = ref('')
const state = ref('')
const zip = ref('')
const country = ref('')

// Error messages for each field
const nameErrorMessages = ref('')
const addressErrorMessages = ref('')
const cityErrorMessages = ref('')
const stateErrorMessages = ref('')
const zipErrorMessages = ref('')
const countryErrorMessages = ref('')

// Form refs for validation
const nameRef = ref()
const addressRef = ref()
const cityRef = ref()
const stateRef = ref()
const zipRef = ref()
const countryRef = ref()

const formRefs = {
  name: nameRef,
  address: addressRef,
  city: cityRef,
  state: stateRef,
  zip: zipRef,
  country: countryRef,
}

const formHasErrors = ref(false)

// Store all submissions
const submissions = ref([])

function submit() {
  formHasErrors.value = false

  // Validate each field
  Object.values(formRefs).forEach((refInput) => {
    if (refInput.value?.validate) {
      const result = refInput.value.validate(true)
      if (!result) formHasErrors.value = true
    }
  })

  // If no errors, save the submission
  if (!formHasErrors.value) {
    submissions.value.push({
      name: name.value,
      address: address.value,
      city: city.value,
      state: state.value,
      zip: zip.value,
      country: country.value,
    })

    // Reset the form after submission
    resetForm()
  }
}

function resetForm() {
  Object.values(formRefs).forEach((refInput) => {
    if (refInput.value?.reset) {
      refInput.value.reset()
    }
  })

  name.value = ''
  address.value = ''
  city.value = ''
  state.value = ''
  zip.value = ''
  country.value = ''
}
function deleteSubmission(index) {
  submissions.value.splice(index, 1)
}
// address
// function formatText() {
//   const code = 'P-3'
//   const barangay = 'Liboon'
//   const area = 'Ampayon'
//   const house = 'Rigene Boarding house'

//   return `${code} ${barangay} ${area},${area},${barangay} ${house}`
// }
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
  position: relative;
  top: 1rem;
  margin-right: 2rem;
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
.card_permanent {
  position: relative;
}

/*spacing in profile */
.vrow {
  padding: 0px;
  margin: 0px;
}
.tight-text {
  letter-spacing: 0;
}
</style>
