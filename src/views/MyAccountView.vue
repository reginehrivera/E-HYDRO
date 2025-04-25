<!-- base layout for MyAccount -->
<template>
  <div class="layout">
    <NavigationBar />
    <main class="content">
      <!--  card  -->

      <div v-if="isMyAccountPage">
        <v-card
          class="v-cardv2"
          height="600"
          width="1000"
          hover
          :style="{ background: 'linear-gradient(10deg,#BBDEFB,#C5CAE9)' }"
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
              Edit Profile
              <v-row justify="start">
                <v-col v-for="k in 1" :key="k" cols="6">
                  <v-text-field
                    v-model="firstname"
                    :counter="10"
                    :rules="nameRules"
                    label="First name"
                    required
                  ></v-text-field>
                </v-col>

                <v-col v-for="k in 1" :key="k" cols="6">
                  <v-text-field
                    v-model="lastname"
                    :counter="10"
                    :rules="nameRules"
                    label="Last name"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row justify="start">
                <v-col v-for="k in 1" :key="k" cols="6">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
                </v-col>
                <v-col v-for="k in 1" :key="k" cols="6">
                  <v-text-field
                    v-model="phone"
                    :rules="phoneRules"
                    label="Phone Number"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="start">
                <v-col v-for="k in 1" :key="k" cols="6">
                  <v-text-field
                    v-model="newPassword"
                    :rules="passwordRules"
                    label="New Password"
                    required
                  ></v-text-field>
                </v-col>
                <v-col v-for="k in 1" :key="k" cols="6">
                  <v-text-field
                    v-model="confirmPassword"
                    :rules="confirmPasswordRules"
                    label="Confirm Password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="end">
                <v-col cols="12" md="4" sm="6">
                  <v-btn :style="{ backgroundColor: '#64B5F6', color: 'black' }" rounded="lg" block
                    >Save Changes</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </div>
      <!-- Extension for addresses -->
      <div v-if="SelectedPage">
        <div class="d-flex justify-center">
          <v-card
            class="v-cardv2"
            height="500"
            width="1000"
            hover
            :style="{ background: 'linear-gradient(10deg,#BBDEFB,#C5CAE9)' }"
          >
            <div class="d-flex justify-end">
              <v-btn class="btn" :style="{ background: '#64B5F6' }" @click="overlay = !overlay">
                + Add Address
              </v-btn>
              <v-overlay v-model="overlay"  class="d-flex justify-center align-center">
                <div class="d-flex justify-content-center">
                  <v-row >
                  <v-col class="d-flex justify-center pa-0" cols="auto">
                    <v-card ref="form" class="pa-4" style="width: fit-content; max-width: 100%">
                      <v-card-text style="min-width: 320px">
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
            <div class="d-flex justify-center my-4">
              <v-avatar color="red" size="80">
                <span class="text-h5">CJ</span>
              </v-avatar>
            </div>
            <div class="d-flex justify-center my">John Doe</div>
            <div class="d-flex justify-center my">JohnDoe@gmail.com</div>
            <span class="spanex">Address</span>

            <v-row class="row">
              <v-col cols="12" md="4" sm="6">
                <v-text-field placeholder="" variant="plain" readonly="">JohnDoe</v-text-field>
              </v-col>
              <v-col cols="12" md="4" sm="6">
                <v-text-field placeholder="" variant="plain" readonly="">0999999999</v-text-field>
              </v-col>
            </v-row>
            <v-row class="row">
              <v-col cols="12" md="4" sm="6">
                <v-text-field placeholder="" variant="plain" readonly="">ampayon</v-text-field>
              </v-col>
            </v-row>
            <v-row class="row">
              <v-col cols="12" md="4" sm="6">
                <v-text-field placeholder="" variant="plain" readonly="">JohnDoe</v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </div>
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
    errorMessages.value =
      address.value && !name.value ? `Hey! I'm required` : ''
    return true
  }

  function resetForm() {
    errorMessages.value = ''
    formHasErrors.value = false

    Object.values(formRefs).forEach(refInput => {
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

    Object.values(formRefs).forEach(refInput => {
      if (refInput.value?.validate) {
        const result = refInput.value.validate(true)
        if (!result) formHasErrors.value = true
      }
    })
  }
</script>

<style scoped>
.content {
  background-image: url('/src/assets/img/bg-home.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 2rem;
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
.v-cardv2 {
  top: 5rem;
}
.v-container {
  padding: 40px;
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
</style>
