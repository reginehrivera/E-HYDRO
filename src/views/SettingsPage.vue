<template>
  <NavigationBar>
    <template #content>
      <v-container fluid class="bg-image">
        <v-card class="mx-auto" max-width="600" elevation="4">
          <v-card-title class="text-h6 font-weight-bold">Settings</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-expansion-panels multiple>
              <!-- Profile Settings -->
              <v-expansion-panel>
                <v-expansion-panel-title>👤 Profile</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-text-field label="Full Name" v-model="profileName.value" />
                  <v-text-field label="Email" v-model="profileEmail.value" />
                  <v-btn color="primary" @click="saveProfile">Save</v-btn>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Payment Methods -->
              <v-expansion-panel>
                <v-expansion-panel-title>💳 Payment Methods</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <p>You can manage your e-wallets or linked accounts here.</p>
                  <v-text-field label="GCash Number" v-model="gcash.value" />
                  <v-text-field label="PayMaya Number" v-model="paymaya.value" />
                  <v-btn color="primary" @click="savePayments">Update Payment Info</v-btn>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Privacy and Security -->
              <v-expansion-panel>
                <v-expansion-panel-title>🔒 Privacy & Security</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-switch
                    v-model="enable2FA.value"
                    label="Enable Two-Factor Authentication"
                  ></v-switch>
                  <v-btn color="primary" class="mt-2" @click="changePassword">
                    Change Password
                  </v-btn>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Language Preferences -->
              <v-expansion-panel>
                <v-expansion-panel-title>🌐 Language Preferences</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-select
                    v-model="language.value"
                    :items="languages"
                    label="Select Language"
                    @change="changeLanguage"
                  ></v-select>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Help -->
              <v-expansion-panel>
                <v-expansion-panel-title>❓ Help & Support</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list dense>
                    <v-list-item><v-list-item-title>📖 FAQs</v-list-item-title></v-list-item>
                    <v-list-item
                      ><v-list-item-title>📞 Contact Support</v-list-item-title></v-list-item
                    >
                    <v-list-item
                      ><v-list-item-title>📜 Terms & Conditions</v-list-item-title></v-list-item
                    >
                    <v-list-item
                      ><v-list-item-title>🚨 Report a Problem</v-list-item-title></v-list-item
                    >
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-container>
    </template>
  </NavigationBar>
</template>

<script setup>
import { ref } from 'vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'

// Profile
const profileName = ref('')
const profileEmail = ref('')

// Payments
const gcash = ref('')
const paymaya = ref('')

// Security
const enable2FA = ref(false)

// Language
const language = ref('en')
const languages = [
  { text: 'English', value: 'en' },
  { text: 'Spanish', value: 'es' },
  { text: 'French', value: 'fr' },
]

// Methods
const saveProfile = () => {
  console.log('Profile saved', {
    name: profileName.value,
    email: profileEmail.value,
  })
}

const savePayments = () => {
  console.log('Payment info saved', {
    gcash: gcash.value,
    paymaya: paymaya.value,
  })
}

const changePassword = () => {
  alert('Redirect to password change page or dialog')
}

const changeLanguage = (lang) => {
  console.log('Language changed to:', lang)
}
</script>

<style scoped>
.bg-image {
  background-image: url('@/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding-top: 100px;
}
</style>
