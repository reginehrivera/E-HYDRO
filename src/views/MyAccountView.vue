<!-- base layout for MyAccount -->
<template>
  <div class="layout">
    <NavigationBar />
    <main class="content">
      <!--  card  -->
      <v-card
        class="v-card ms-5"
        max-width="344"
        height="25rem"
        hover
        :style="{ background: 'linear-gradient(10deg,#BBDEFB,#C5CAE9)' }"
      >
        <v-card-item>
          <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" cover>
            <v-avatar color="surface-variant" size="90" class="avatar">
              <span class="text-h5">CJ</span>
            </v-avatar>
          </v-parallax>
          <v-card-title> Edit Profile </v-card-title>
        </v-card-item>

        <v-card-text>

          <router-link
            :to="{ name: 'addresses' }"
            class="link"
            :class="{ 'v-btn--active': $route.name === 'addresses' }"
            >Address</router-link
          >
          <br />
          <router-link
            :to="{ name: 'Myaccount' }"
            class="link"
            :class="{ 'v-btn--active': $route.name === 'Myaccount' }"
          >
            Profile Settings</router-link
          >
          <br />
          Payment & methods <br />
          Privacy & Security
        </v-card-text>
      </v-card>
     <div v-if="isMyAccountPage">
      <v-card
        class="v-cardv2"
        height="500"
        width="900"
        hover
        :style="{ background: 'linear-gradient(10deg,#BBDEFB,#C5CAE9)' }"
      >
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
<script>
import NavigationBar from '@/components/layout/NavigationBar.vue'
export default {
  name: 'MyAccountView',
  components: {
    NavigationBar,
  },
  data() {
    return {
      valid: false,
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      newPassword: '',
      confirmPassword: '',

      nameRules: [
        (v) => !!v || 'Name is required.',
        (v) => v.length <= 10 || 'Name must be less than 10 characters.',
      ],

      emailRules: [
        (v) => !!v || 'E-mail is required.',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
      ],

      phoneRules: [
        (v) => !!v || 'Phone number is required.',
        (v) => /^\d{10,15}$/.test(v) || 'Phone number must be valid (10–15 digits).',
      ],

      passwordRules: [
        (v) => !!v || 'Password is required.',
        (v) => v.length >= 6 || 'Password must be at least 6 characters.',
      ],
    }
  },
  computed: {
    confirmPasswordRules() {
      return [
        (v) => !!v || 'Confirmation is required.',
        (v) => v === this.newPassword || 'Passwords do not match.',
      ]
    },
    isMyAccountPage() {
      return this.$route.name === 'Myaccount'
    },
  },
}
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
.v-card {
  margin-top: 7.5rem;
}
.v-cardv2 {
  position: relative;
  right: -30rem;
  top: -33rem;
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
