  <!-- base layout for MyAccount -->
  <template>
  <div class="layout">
    <NavigationBar />
  <main class="content">
    <slot/>

   <!--  card  -->
    <v-card
    class="v-card ms-5"
    max-width="344" height="25rem"
    hover
  >
    <v-card-item>
      <v-avatar color="surface-variant" size="90"></v-avatar>
      <v-card-title>
    Edit Profile
      </v-card-title>
    </v-card-item>

    <v-card-text>
      Order list <br>
      Addresses <br>
      Profile Settings <br>
      Payment & methods <br>
      Privacy & Security
    </v-card-text>
  </v-card>

  <v-card  class="v-cardv2" height="500"width="900" hover>
    <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="firstname"
            :counter="10"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="lastname"
            :counter="10"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
          v-model="phone"
            :rules="phoneRules"
            label="Phone Number"
            required
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
          v-model="newPassword"
            :rules="passwordRules"
            label="New Password"
            required
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
          v-model="confirmPassword"
            :rules="confirmPasswordRules"
            label="Confirm Password"
            required
          ></v-text-field>
        </v-col>

      </v-row>
    </v-container>
  </v-form>
  </v-card>


  </main>
  </div>
  </template>
  <script>
import NavigationBar from '@/components/layout/NavigationBar.vue';
export default {
  components: {
    NavigationBar
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
        v => !!v || 'Name is required.',
        v => v.length <= 10 || 'Name must be less than 10 characters.',
      ],

      emailRules: [
        v => !!v || 'E-mail is required.',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
      ],

      phoneRules: [
        v => !!v || 'Phone number is required.',
        v => /^\d{10,15}$/.test(v) || 'Phone number must be valid (10-15 digits).',
      ],

      passwordRules: [
        v => !!v || 'Password is required.',
        v => v.length >= 6 || 'Password must be at least 6 characters.',
      ],

      confirmPasswordRules: [
        v => !!v || 'Confirmation is required.',
        v => v === this.newPassword || 'Passwords do not match.',
      ],
    };
  },
};
  </script>
  <style scoped>
  .content{
  background-image: url('/src/assets/img/bg-home.png');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  padding: 2rem;
  }
  .v-card{
    margin-top: 7.5rem;
  }
  .v-cardv2{
  position: relative;
  right: -30rem;
  top:-33rem;

  }
  </style>
