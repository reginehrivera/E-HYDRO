<template>
  <v-container class="pa-0 fill-height" fluid>
    <!-- Custom Loading Screen -->
    <loading-page v-if="loading" :show="loading" @loading-complete="onLoadingComplete" />

    <div class="page-container">
      <v-card class="wrapper" elevation="10">
        <!-- Logo Section -->
        <div class="logo">
          <v-img :src="logonImage" alt="Logo" max-width="190" class="mx-auto"></v-img>
        </div>

        <!-- Form Container -->
        <div class="form-container">
          <!-- Tab Controls -->
          <div class="slide-controls">
            <input
              type="radio"
              name="slide"
              id="login"
              v-model="currentForm"
              value="login"
              @change="switchToLogin"
            />
            <input
              type="radio"
              name="slide"
              id="signup"
              v-model="currentForm"
              value="signup"
              @change="switchToSignup"
            />
            <label for="login" class="slide login">Login</label>
            <label for="signup" class="slide signup">Signup</label>
            <div class="slider-tab" :class="{ right: currentForm === 'signup' }"></div>
          </div>

          <!-- Forms -->
          <div class="form-inner" :class="{ move: currentForm === 'signup' }">
            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="login">
              <div class="field">
                <v-text-field
                  v-model="email"
                  placeholder="Email Address"
                  type="text"
                  variant="outlined"
                  density="compact"
                  required
                  hide-details
                  single-line
                ></v-text-field>
              </div>

              <div class="field">
                <v-text-field
                  v-model="password"
                  :type="passwordType"
                  placeholder="Password"
                  variant="outlined"
                  density="compact"
                  required
                  hide-details
                  single-line
                  :append-inner-icon="passwordType === 'password' ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="togglePasswordVisibility"
                ></v-text-field>
              </div>

              <div class="form-options">
                <div class="remember-me">
                  <v-checkbox
                    id="remember"
                    label="Remember me"
                    density="compact"
                    hide-details
                    color="#0044cc"
                  ></v-checkbox>
                </div>
                <div class="pass-link">
                  <a href="#">Forgot password?</a>
                </div>
              </div>

              <div class="field btn mt-4">
                <div class="btn-layer"></div>
                <v-btn type="submit" block height="40" rounded="xl" class="custom-btn">Login</v-btn>
              </div>

              <div class="signup-link">
                Don't have an account? <a href="#" @click.prevent="switchToSignup">Signup</a>
              </div>
            </form>

            <!-- Signup Form -->
            <form @submit.prevent="handleSignup" class="signup">
              <div class="field">
                <v-text-field
                  v-model="name"
                  placeholder="Full Name"
                  type="text"
                  variant="outlined"
                  density="compact"
                  required
                  hide-details
                  single-line
                ></v-text-field>
              </div>

              <div class="field">
                <v-text-field
                  v-model="contactNumber"
                  placeholder="Contact Number"
                  type="text"
                  variant="outlined"
                  density="compact"
                  required
                  hide-details
                  single-line
                ></v-text-field>
              </div>

              <div class="field">
                <v-text-field
                  v-model="email"
                  placeholder="Email Address"
                  type="text"
                  variant="outlined"
                  density="compact"
                  required
                  hide-details
                  single-line
                ></v-text-field>
              </div>

              <div class="field">
                <v-text-field
                  v-model="password"
                  :type="passwordType"
                  placeholder="Password"
                  variant="outlined"
                  density="compact"
                  required
                  hide-details
                  single-line
                  :append-inner-icon="passwordType === 'password' ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="togglePasswordVisibility"
                ></v-text-field>
              </div>

              <div class="field">
                <v-text-field
                  v-model="confirmPassword"
                  :type="confirmPasswordType"
                  placeholder="Confirm Password"
                  variant="outlined"
                  density="compact"
                  required
                  hide-details
                  single-line
                  :append-inner-icon="
                    confirmPasswordType === 'password' ? 'mdi-eye-off' : 'mdi-eye'
                  "
                  @click:append-inner="toggleConfirmPasswordVisibility"
                ></v-text-field>
              </div>

              <div class="field btn mt-4">
                <div class="btn-layer"></div>
                <v-btn type="submit" block height="40" rounded="xl" class="custom-btn"
                  >Signup</v-btn
                >
              </div>

              <div class="login-link">
                Already have an account? <a href="#" @click.prevent="switchToLogin">Login</a>
              </div>
            </form>
          </div>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logonImage from '@/assets/img/logon.png'
import { supabase } from '@/supabase'
import { useUserStore } from '@/stores/user'
import LoadingPage from '@/components/layout/LoadingPage.vue'

const loading = ref(false)
const router = useRouter()
const currentForm = ref<'login' | 'signup'>('login')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordType = ref<'password' | 'text'>('password')
const confirmPasswordType = ref<'password' | 'text'>('password')
const name = ref('')
const contactNumber = ref('')
const error = ref('')

// Loading page handling
const onLoadingComplete = () => {
  // You can add additional logic here if needed
  // This gets called when the loading animation completes
}

// Switch forms
const switchToSignup = () => {
  currentForm.value = 'signup'
  password.value = ''
  confirmPassword.value = ''
}

const switchToLogin = () => {
  currentForm.value = 'login'
  password.value = ''
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  // Show loading for at least 3 seconds
  const loadingPromise = new Promise((resolve) => setTimeout(resolve, 3000))

  try {
    const [_, { data: authData, error: authError }] = await Promise.all([
      loadingPromise,
      supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      }),
    ])

    if (authError) throw authError
    const user = authData.user
    if (!user) throw new Error('Failed to fetch user info.')

    // Fetch profile from 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, contact_number, avatar_url')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    const userStore = useUserStore()
    userStore.setUserData({
      email: user.email,
      fullname: profile.full_name,
      mobile: profile.contact_number,
      avatar_url: profile.avatar_url || '',
    })

    localStorage.setItem('email', user.email)
    router.push('/home')
  } catch (err) {
    console.error('Authentication error:', err)
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    loading.value = false
  }
}

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords don't match!")
    return
  }

  loading.value = true

  // Show loading for at least 3 seconds
  const loadingPromise = new Promise((resolve) => setTimeout(resolve, 3000))

  try {
    // Check if email already exists in 'profiles' table
    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email.value)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      throw userError
    }

    if (existingUser) {
      alert('Email is already registered. Please login or use a different email.')
      loading.value = false
      return
    }

    // Sign up and set full_name in user_metadata
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: name.value, // ✅ Add to user_metadata
        },
      },
    })

    if (signUpError) {
      throw new Error(`Sign up error: ${signUpError.message}`)
    }

    const user = signUpData.user
    if (!user) throw new Error('Signup succeeded, but user data is missing.')

    console.log('User ID:', user.id)

    // Insert into 'profiles' table
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        full_name: name.value,
        contact_number: contactNumber.value,
        email: email.value,
      },
    ])

    if (profileError) {
      console.error('Profile insert error:', profileError)
      throw new Error(`Profile insertion failed: ${profileError.message}`)
    }

    const userStore = useUserStore()
    userStore.setUserData({
      email: email.value,
      full_name: name.value,
      contact_number: contactNumber.value,
    })

    alert('Signup successful! Redirecting you to your dashboard...')
    router.push('/home')
  } catch (err) {
    console.error('Signup error:', err)
    alert(err instanceof Error ? err.message : 'Signup failed')
    loading.value = false
  }
}

// Toggle password visibility
const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordType.value = confirmPasswordType.value === 'password' ? 'text' : 'password'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

/* Layout */
.page-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: url('../assets/img/bg-home-no-gallon.png') no-repeat center center;
  background-size: cover;
}

.wrapper {
  overflow: hidden;
  max-width: 350px;
  width: 100%;
  background: #fff;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.1) !important;
}

/* Logo */
.logo {
  text-align: center;
  margin-top: -30px;
  margin-bottom: -50px;
}

/* Tab Controls */
.slide-controls {
  position: relative;
  display: flex;
  height: 39px;
  width: 100%;
  overflow: hidden;
  margin: 20px 0 15px 0;
  justify-content: space-between;
  border: 1px solid lightgrey;
  border-radius: 30px;
}

.slide-controls .slide {
  height: 100%;
  width: 100%;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  line-height: 38px;
  cursor: pointer;
  z-index: 1;
  transition: all 0.6s ease;
}

.slide-controls label.signup {
  color: #000;
}

.slider-tab {
  position: absolute;
  height: 100%;
  width: 50%;
  left: 0;
  z-index: 0;
  border-radius: 20px;
  background: -webkit-linear-gradient(left, #0044cc, #00c6ff);
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-controls input[type='radio'] {
  display: none;
}

.slider-tab.right {
  left: 50%;
}

#signup:checked ~ label.signup {
  color: #fff;
  cursor: default;
  user-select: none;
}

#signup:checked ~ label.login {
  color: #000;
}

#login:checked ~ label.signup {
  color: #000;
}

#login:checked ~ label.login {
  cursor: default;
  user-select: none;
}

/* Form Container */
.form-container {
  width: 100%;
  overflow: hidden;
}

.form-inner {
  display: flex;
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: translateX(0%);
}

.form-inner.move {
  transform: translateX(-100%);
}

.form-inner form {
  min-width: 100%;
}

/* Form Elements */
.field {
  margin-top: 15px;
  position: relative;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;

  color: #555;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.pass-link a,
.signup-link a,
.login-link a {
  color: #09a7d3;
  text-decoration: none;
}

.pass-link a {
  font-size: 14px;
  margin-left: 10px; /* Adjust gap to the left if needed */
  text-decoration: none;
}
.pass-link a:hover,
.signup-link a:hover,
.login-link a:hover {
  text-decoration: underline;
}

/* Buttons */
.btn {
  height: 40px;
  width: 100%;
  border-radius: 30px;
  position: relative;
  overflow: hidden;
}

.btn .btn-layer {
  height: 100%;
  width: 200%;
  position: absolute;
  left: -100%;
  background: -webkit-linear-gradient(right, #00c6ff, #0044cc, #00c6ff, #0044cc);
  border-radius: 5px;
  transition: all 0.4s ease;
}

.btn:hover .btn-layer {
  left: 0;
}

.custom-btn {
  font-size: 20px !important;
  font-weight: 100 !important;
  letter-spacing: normal !important;
  background: transparent !important;
  position: relative;
  z-index: 1;
  color: white !important;
  text-transform: none !important;
}

.signup-link,
.login-link {
  text-align: center;
  margin-top: 30px;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

/* Vuetify Field Overrides */
:deep(.v-text-field .v-field) {
  font-size: 15px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  border-bottom-width: 2px;
}

:deep(.v-text-field .v-field__input) {
  padding: 0 10px;
  min-height: 32px;
}

:deep(.v-text-field .v-field__outline) {
  display: none;
}

:deep(.v-text-field .v-field--variant-outlined) {
  background: transparent;
}

:deep(.v-text-field .v-field--focused) {
  border-color: #00c6ff !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 5px;
    margin-right: 0;
  }

  .wrapper {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .wrapper {
    padding: 30px;
  }

  .slide-controls .slide {
    font-size: 17px;
    line-height: 35px;
  }

  .form-options {
    font-size: 10px;
  }

  .remember-me {
    gap: 2px;
    margin-top: 4px;
  }
}

@media (max-width: 400px) {
  .wrapper {
    width: 90% !important;
    padding: 15px !important;
  }

  .v-text-field,
  .v-btn {
    font-size: 14px;
  }

  .slide-controls label {
    font-size: 14px;
  }

  .signup-link,
  .login-link {
    font-size: 13px;
    text-align: center;
  }

  .form-options {
    gap: 4px;
  }
}
</style>
