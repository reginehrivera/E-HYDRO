<template>

  <router-view />
</template>

<script lang="ts">



export default {

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
