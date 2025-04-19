<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
  </div>

  <div class="page-container">
    <div class="wrapper">
      <div class="logo">
        <img :src="logonImage" alt="Logo" />
      </div>

      <div class="form-container">
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

        <div class="form-inner" :class="{ move: currentForm === 'signup' }">
          <form @submit.prevent="handleLogin" class="login">
            <div class="field">
              <input type="text" v-model="email" placeholder="Email Address" required />
            </div>
            <div class="field">
              <input :type="passwordType" v-model="password" placeholder="Password" required />
              <span
                class="eye-icon"
                :class="{ show: passwordType === 'password' }"
                @click="togglePasswordVisibility"
              ></span>
            </div>

            <div class="form-options">
              <div class="remember-me">
                <input type="checkbox" id="remember" />
                <label for="remember"> Remember me</label>
              </div>
              <div class="pass-link">
                <a href="#">Forgot password?</a>
              </div>
            </div>

            <div class="field btn">
              <div class="btn-layer"></div>
              <input type="submit" value="Login" />
            </div>
            <div class="signup-link">
              Don't have an account? <a href="#" @click.prevent="switchToSignup">Signup</a>
            </div>
          </form>

          <form @submit.prevent="handleSignup" class="signup">
            <div class="field">
              <input type="text" v-model="email" placeholder="Email Address" required />
            </div>
            <div class="field">
              <input :type="passwordType" v-model="password" placeholder="Password" required />
              <span
                class="eye-icon"
                :class="{ show: passwordType === 'password' }"
                @click="togglePasswordVisibility"
              ></span>
            </div>
            <div class="field">
              <input
                :type="confirmPasswordType"
                v-model="confirmPassword"
                placeholder="Confirm password"
                required
              />
              <span
                class="eye-icon"
                :class="{ show: confirmPasswordType === 'password' }"
                @click="toggleConfirmPasswordVisibility"
              ></span>
            </div>

            <div class="field btn">
              <div class="btn-layer"></div>
              <input type="submit" :value="'Signup'" />
            </div>
            <div class="login-link">
              Already have an account? <a href="#" @click.prevent="switchToLogin">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logonImage from '@/assets/img/logon.png'
import { supabase } from '@/supabase'

export default {
  setup() {
    const loading = ref(false)
    const router = useRouter()
    const currentForm = ref<'login' | 'signup'>('login')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const passwordType = ref('password')
    const confirmPasswordType = ref('password')

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

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      loading.value = false

      if (error) {
        alert(error.message)
        return
      }

      const user = data.user
      console.log('Logged in as:', user)

      router.push('/home')
    }

    const handleSignup = async () => {
      if (password.value !== confirmPassword.value) {
        alert("Passwords don't match!")
        return
      }

      loading.value = true

      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })

      loading.value = false

      if (error) {
        alert(error.message)
      } else {
        const user = data.user
        alert(
          'A confirmation email has been sent to your email address. Please check your inbox and confirm your email.',
        )

        router.push('/home')
      }
    }

    const togglePasswordVisibility = () => {
      passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
    }

    const toggleConfirmPasswordVisibility = () => {
      confirmPasswordType.value = confirmPasswordType.value === 'password' ? 'text' : 'password'
    }

    return {
      currentForm,
      switchToSignup,
      switchToLogin,
      handleLogin,
      handleSignup,
      logonImage,
      loading,
      email,
      password,
      confirmPassword,
      passwordType,
      confirmPasswordType,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.page-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: url('../assets/img/body.png') no-repeat center center;
  background-size: cover;
}

.slider-tab {
  transition: all 0.6s ease-in-out;
}

.slider-tab.right {
  left: 50%;
}

.wrapper {
  overflow: hidden;
  max-width: 390px;
  width: 100%;
  background: #fff;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.1);
}

.wrapper .slide-controls {
  position: relative;
  display: flex;
  height: 40px;
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
.wrapper .form-container {
  width: 100%;
  overflow: hidden;
}
.form-container .form-inner {
  display: flex;
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: translateX(0%);
}

.form-container .form-inner.move {
  transform: translateX(-100%);
}

.form-container .form-inner form {
  min-width: 100%;
}
.form-inner form .field {
  height: 40px;
  width: 100%;
  margin-top: 15px;
}
.form-inner form .field input {
  height: 100%;
  width: 100%;
  outline: none;
  padding-left: 15px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  border-bottom-width: 2px;
  font-size: 17px;
  transition: all 0.3s ease;
}
.form-inner form .field input:focus {
  border-color: #00c6ff;
}
.form-inner form .field input::placeholder {
  color: #999;
  transition: all 0.3s ease;
}
form .field input:focus::placeholder {
  color: #b3b3b3;
}
.form-inner form .pass-link {
  margin-top: 5px;
}
.form-inner form .signup-link,
.form-inner form .login-link {
  text-align: center;
  margin-top: 30px;
}
.form-inner form .pass-link a,
.form-inner form .signup-link a,
.form-inner form .login-link a {
  color: #09a7d3;
  text-decoration: none;
}
.form-inner form .pass-link a:hover,
.form-inner form .signup-link a:hover,
.form-inner form .login-link a:hover {
  text-decoration: underline;
}
form .btn {
  height: 50px;
  width: 100%;
  border-radius: 30px;
  position: relative;
  overflow: hidden;
}
form .btn .btn-layer {
  height: 100%;
  width: 200%;
  position: absolute;
  left: -100%;
  background: -webkit-linear-gradient(right, #00c6ff, #0044cc, #00c6ff, #0044cc);
  border-radius: 5px;
  transition: all 0.4s ease;
}
form .btn:hover .btn-layer {
  left: 0;
}
form .btn input[type='submit'] {
  height: 100%;
  width: 100%;
  z-index: 1;
  position: relative;
  background: none;
  border: none;
  color: #fff;
  padding-left: 0;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
}
.logo {
  text-align: center;
  margin-top: -30px;
  margin-bottom: -50px;
}
.logo img {
  max-width: 190px;
  height: auto;
}
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 14px;
  color: #555;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.form-container .form-inner {
  display: flex;
  width: 100%;
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: translateX(0%);
}

.form-container .form-inner.move {
  transform: translateX(-100%);
}

.field {
  position: relative;
}

input[type='password'] {
  padding-right: 5px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #00c6ff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 5px;
    margin-right: 0;
  }

  .wrapper {
    padding: 20px;
  }

  .logo img {
    width: 60%;
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

  .logo img {
    width: 70%;
  }

  .form-options {
    font-size: 10px;
  }

  .form-inner form .field input {
    font-size: 15px;
  }
}
</style>
