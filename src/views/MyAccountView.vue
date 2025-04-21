  <!-- base layout for MyAccount -->
  <template>
  <div class="layout">
    <NavigationBar />
  <main class="content">
    <slot/>

   <!--  card  -->
    <v-card
    class="v-card ms-5"
    max-width="344"
    hover
  >
    <v-card-item>
      <v-card-title>
        Card title
      </v-card-title>

      <v-card-subtitle>
        Card subtitle secondary text
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </v-card-text>
  </v-card>


  </main>
  </div>
  </template>
  <script>
import NavigationBar from '@/components/layout/NavigationBar.vue';
export default {
  components: {
    NavigationBar
  }
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
  </style>
