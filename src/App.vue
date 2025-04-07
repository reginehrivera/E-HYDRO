<template>
  <TestComponent/>
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
        <form @submit.prevent class="login">
          <div class="field">
            <input type="text" placeholder="Email Address" required />
          </div>
          <div class="field">
            <input type="password" placeholder="Password" required />
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
        <form @submit.prevent class="signup">
          <div class="field">
            <input type="text" placeholder="Email Address" required />
          </div>
          <div class="field">
            <input type="password" placeholder="Password" required />
          </div>
          <div class="field">
            <input type="password" placeholder="Confirm password" required />
          </div>
          <div class="field btn">
            <div class="btn-layer"></div>
            <input type="submit" value="Signup" />
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
  <router-view />
</template>

<script lang="ts">
import { ref } from 'vue'
import logonImage from '@/assets/img/logon.png'
import fbIcon from '@/assets/img/fb.png'
import xIcon from '@/assets/img/x.png'
import googleIcon from '@/assets/img/google.png'
import TestComponent from './components/TestComponent.vue'


export default {
  name:'App',
   components:{
    TestComponent,
   },
  setup() {
    const currentForm = ref<'login' | 'signup'>('login')

    const switchToSignup = () => {
      currentForm.value = 'signup'
    }

    const switchToLogin = () => {
      currentForm.value = 'login'
    }

    return {
      currentForm,
      switchToSignup,
      switchToLogin,
      logonImage,
      fbIcon,
      xIcon,
      googleIcon,
    }
  },
}
</script>
