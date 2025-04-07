<template>
  <!-- 🔄 LOADING SPINNER -->
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
              <input type="text" placeholder="Email Address" required />
            </div>
            <div class="field">
              <input :type="passwordType" v-model="password" placeholder="Password" required />
              <span class="eye-icon" @click="togglePasswordVisibility"></span>
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
              Don't have an account? <a href="#" @click.prevent="switchToSignup">Signup now</a>
            </div>

            <div class="or-divider">-OR-</div>
            <div class="social-icons">
              <img :src="fbIcon" alt="Facebook" />
              <img :src="xIcon" alt="X" />
              <img :src="googleIcon" alt="Google" />
            </div>
          </form>

          <form @submit.prevent="handleSignup" class="signup">
            <div class="field">
              <input type="text" placeholder="Email Address" required />
            </div>
            <div class="field">
              <input :type="passwordType" v-model="password" placeholder="Password" required />
              <span class="eye-icon" @click="togglePasswordVisibility"></span>
            </div>
            <div class="field">
              <input
                :type="confirmPasswordType"
                v-model="confirmPassword"
                placeholder="Confirm password"
                required
              />
              <span class="eye-icon" @click="toggleConfirmPasswordVisibility"></span>
            </div>

            <div class="field btn">
              <div class="btn-layer"></div>
              <input type="submit" :value="'Signup'" />
            </div>
            <div class="login-link">
              Already have an account? <a href="#" @click.prevent="switchToLogin">Login</a>
            </div>

            <div class="or-divider">-OR-</div>
            <div class="social-icons">
              <img :src="fbIcon" alt="Facebook" />
              <img :src="xIcon" alt="X" />
              <img :src="googleIcon" alt="Google" />
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
import fbIcon from '@/assets/img/fb.png'
import xIcon from '@/assets/img/x.png'
import googleIcon from '@/assets/img/google.png'

export default {
  setup() {
    const loading = ref(false)
    const router = useRouter()
    const currentForm = ref<'login' | 'signup'>('login')
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

    const handleLogin = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        router.push('/home')
      }, 2000)
    }

    const handleSignup = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        router.push('/home')
      }, 2000)
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
      fbIcon,
      xIcon,
      googleIcon,
      loading,
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

<style>
@import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
html,
body {
  height: 100%;
  width: 100%;
  background: url('@/assets/img/body.png') no-repeat center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-container {
  margin-right: -200px;
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
.slide-controls .slider-tab {
  position: absolute;
  height: 100%;
  width: 55%;
  left: 0;
  z-index: 0;
  border-radius: 30px;
  background: -webkit-linear-gradient(left, #0044cc, #00c6ff);
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
input[type='radio'] {
  display: none;
}

#signup:checked ~ .slider-tab {
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
.or-divider {
  text-align: center;
  margin: 15px 0;
  font-size: 14px;
  color: #777;
}
.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}
.social-icons img {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: 0.3s ease;
}
.social-icons img:hover {
  transform: scale(1.1);
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
    padding: 10px;
  }

  .logo img {
    width: 50%;
  }
}
</style>
