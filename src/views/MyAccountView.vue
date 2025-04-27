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
            width="auto"
            height="20rem"
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
        <v-col class="card-v2" v-if="isMyAccountPage">
          <v-card class="" height="600" width="100%" hover :style="{ background: '#D9D9D9' }">
            <span class="text-h5 font-weight-medium d-flex justify-center my-4"
              >Profile Settings</span
            >
            <div class="d-flex justify-center my-4">
              <v-avatar color="red" size="80">
                <span class="text-h5">CJ</span>
              </v-avatar>
            </div>
            <div class="d-flex justify-center my">John Doe</div>
            <div class="d-flex justify-center my">JohnDoe@gmail.com</div>

            <v-form v-model="valid">
              <v-container>
                <v-row justify="start" style="max-height: 90px">
                  <v-col cols="6">
                    <span style="color: #919191">First Name</span>
                    <v-text-field label="First name" model-value="" variant="solo" />
                  </v-col>
                  <v-col cols="6">
                    <span style="color: #919191">Last Name</span>
                    <v-text-field label="Last name" model-value="" variant="solo" />
                  </v-col>
                </v-row>

                <v-row justify="start" style="max-height: 90px">
                  <v-col cols="6">
                    <span style="color: #919191">Email</span>
                    <v-text-field label="Email" model-value="" variant="solo" />
                  </v-col>
                  <v-col cols="6">
                    <span style="color: #919191">Phone Number</span>
                    <v-text-field label="Phone number" model-value="" variant="solo" />
                  </v-col>
                </v-row>

                <v-row justify="start">
                  <v-col cols="6">
                    <span style="color: #919191">New Password</span>
                    <v-text-field label="New Password" model-value="" variant="solo" />
                  </v-col>
                  <v-col cols="6">
                    <span style="color: #919191">Confirm Password</span>
                    <v-text-field label="Confirm Password" model-value="" variant="solo" />
                  </v-col>
                </v-row>

                <v-row justify="center">
                  <v-col cols="12" md="4" sm="6">
                    <v-btn
                      :style="{ backgroundColor: '#022650', color: 'white' }"
                      rounded="lg"
                      block
                      >Save Changes</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-col>

        <!-- Extension for addresses -->
        <div v-if="SelectedPage">
          <div>
            <v-card
              class="v-cardv2"
              height="500"
              width="1000"
              hover
              :style="{ background: '#D9D9D9' }"
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
                              :error-messages="errorMessages"
                              :rules="[() => !!name || 'This field is required']"
                              label="Full Name"
                              placeholder="John Doe"
                              required
                            />
                            <v-text-field
                              ref="addressRef"
                              v-model="address"
                              :rules="[
                                () => !!address || 'This field is required',
                                () =>
                                  (!!address && address.length <= 25) ||
                                  'Address must be less than 25 characters',
                                addressCheck,
                              ]"
                              counter="25"
                              label="Address Line"
                              placeholder="Snowy Rock Pl"
                              required
                            />
                            <v-text-field
                              ref="cityRef"
                              v-model="city"
                              :rules="[() => !!city || 'This field is required', addressCheck]"
                              label="City"
                              placeholder="El Paso"
                              required
                            />
                            <v-text-field
                              ref="stateRef"
                              v-model="state"
                              :rules="[() => !!state || 'This field is required']"
                              label="State/Province/Region"
                              placeholder="TX"
                              required
                            />
                            <v-text-field
                              ref="zipRef"
                              v-model="zip"
                              :rules="[() => !!zip || 'This field is required']"
                              label="ZIP / Postal Code"
                              placeholder="79938"
                              required
                            />
                            <v-autocomplete
                              ref="countryRef"
                              v-model="country"
                              :items="countries"
                              :rules="[() => !!country || 'This field is required']"
                              label="Country"
                              placeholder="Select..."
                              required
                            />
                          </v-card-text>

                          <v-divider class="mt-12" />

                          <v-card-actions>
                            <v-btn variant="text">Cancel</v-btn>
                            <v-spacer />
                            <v-slide-x-reverse-transition>
                              <v-tooltip v-if="formHasErrors" location="left">
                                <template #activator="{ props }">
                                  <v-btn icon v-bind="props" @click="resetForm">
                                    <v-icon>mdi-refresh</v-icon>
                                  </v-btn>
                                </template>
                                <span>Refresh form</span>
                              </v-tooltip>
                            </v-slide-x-reverse-transition>
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
                <div class="d-flex justify-center my-4">
                  <v-avatar color="red" size="80">
                    <span class="text-h5">CJ</span>
                  </v-avatar>
                </div>
                <div class="d-flex justify-center my">John Doe</div>
                <div class="d-flex justify-center my">JohnDoe@gmail.com</div>
                <span class="spanex">Address</span>

                <v-row class="row" style="max-height: 50px">
                  <v-col cols="12" md="2" sm="2" class="SpaceinBetween">
                    <v-text-field placeholder="name" variant="plain" readonly=""
                      >JohnDoe</v-text-field
                    >
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field placeholder="contact no" variant="plain" readonly=""
                      >0999999999</v-text-field
                    >
                  </v-col>
                </v-row>
                <v-row class="row" style="max-height: 50px">
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field placeholder="street" variant="plain" readonly=""
                      >ampayon</v-text-field
                    >
                  </v-col>
                </v-row>
                <v-row class="row" style="max-height: 50px">
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field placeholder="city" variant="plain" readonly=""
                      >JohnDoe</v-text-field
                    >
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" md="4" sm="6">
                    <v-btn
                      :style="{ backgroundColor: '#022650', color: 'white' }"
                      rounded="lg"
                      block
                      >Save Changes</v-btn
                    >
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </div>
        </div>
      </v-row>
    </main>
  </div>
</template>
<script setup>
import { ref, computed, watch, reactive } from 'vue'
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

const emailRules = [
  (v) => !!v || 'E-mail is required.',
  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
]

const phoneRules = [
  (v) => !!v || 'Phone number is required.',
  (v) => /^\d{10,15}$/.test(v) || 'Phone number must be valid (10–15 digits).',
]

const passwordRules = [
  (v) => !!v || 'Password is required.',
  (v) => v.length >= 6 || 'Password must be at least 6 characters.',
]

// Computed for confirm password
const confirmPasswordRules = computed(() => [
  (v) => !!v || 'Confirmation is required.',
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

const name = ref('')
const address = ref('')
const city = ref('')
const state = ref('')
const zip = ref('')
const country = ref('')
const errorMessages = ref('')
const formHasErrors = ref(false)

const form = ref(null)

const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antigua &amp; Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia &amp; Herzegovina',
  'Botswana',
  'Brazil',
  'British Virgin Islands',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Cape Verde',
  'Cayman Islands',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Congo',
  'Cook Islands',
  'Costa Rica',
  'Cote D Ivoire',
  'Croatia',
  'Cruise Ship',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Estonia',
  'Ethiopia',
  'Falkland Islands',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Polynesia',
  'French West Indies',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kuwait',
  'Kyrgyz Republic',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macau',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Nepal',
  'Netherlands',
  'Netherlands Antilles',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Norway',
  'Oman',
  'Pakistan',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Reunion',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Pierre &amp; Miquelon',
  'Samoa',
  'San Marino',
  'Satellite',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sri Lanka',
  'St Kitts &amp; Nevis',
  'St Lucia',
  'St Vincent',
  'St. Lucia',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  `Timor L'Este`,
  'Togo',
  'Tonga',
  'Trinidad &amp; Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks &amp; Caicos',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Venezuela',
  'Vietnam',
  'Virgin Islands (US)',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]

// Input refs for validation/reset
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

function addressCheck() {
  errorMessages.value = address.value && !name.value ? `Hey! I'm required` : ''
  return true
}

function resetForm() {
  errorMessages.value = ''
  formHasErrors.value = false

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

function submit() {
  formHasErrors.value = false

  Object.values(formRefs).forEach((refInput) => {
    if (refInput.value?.validate) {
      const result = refInput.value.validate(true)
      if (!result) formHasErrors.value = true
    }
  })
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
</style>
