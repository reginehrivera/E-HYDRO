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
        width="1200"
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
    </main>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'

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
  v => !!v || 'Name is required.',
  v => v.length <= 10 || 'Name must be less than 10 characters.',
]

const emailRules = [
  v => !!v || 'E-mail is required.',
  v => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
]

const phoneRules = [
  v => !!v || 'Phone number is required.',
  v => /^\d{10,15}$/.test(v) || 'Phone number must be valid (10–15 digits).',
]

const passwordRules = [
  v => !!v || 'Password is required.',
  v => v.length >= 6 || 'Password must be at least 6 characters.',
]

// Computed for confirm password
const confirmPasswordRules = computed(() => [
  v => !!v || 'Confirmation is required.',
  v => v === newPassword.value || 'Passwords do not match.',
])

// Route-based check
const isMyAccountPage = computed(() => route.name === 'Myaccount')

</script>



<style scoped>
.content {
  background-image: url('/src/assets/img/bg-home.png');
  background-size: cover;
  background-position: center;
  background-repeat:no-repeat ;
  min-height: 100vh;
  padding: 2rem;

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
