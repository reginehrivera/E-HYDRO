<template>
  <NavigationBar>
    <template #content>
      <v-container fluid class="bg-image">
        <v-row>
          <v-col cols="12" md="5" class="pt-16">
            <h1></h1>
            <p></p>
          </v-col>
          <v-col cols="12" md="7">
            <h2>
              We provide clean, safe, and <br />worry-free water delivered right <br />
              to your doorstep.
            </h2>
            <router-link to="/station"
              ><v-btn class="home-btn"><span>Order Now!</span></v-btn>
            </router-link>
            <!--footer icons-->
            <ul class="footer-icons">
              <li><img :src="firstIcon" alt="" />Convenient <br />Ordering</li>
              <li>
                <img :src="secondIcon" alt="" />Offers <br />Affordable and <br />Quality Water
              </li>
              <li>
                <img :src="thirdIcon" alt="" />Deliver quickly<br />
                to your <br />doorstep
              </li>
              <li>
                <img :src="fourthIcon" alt="" />Recommend a Clean<br />
                & Safe Water <br />Refilling Station
              </li>
            </ul>
            <!--End footer icons-->
          </v-col>
        </v-row>
      </v-container>
    </template>
  </NavigationBar>
</template>

<script setup>
import NavigationBar from '@/components/layout/NavigationBar.vue'

import firstIcon from '@/assets/img/first-icon.png'
import secondIcon from '@/assets/img/second-icon.png'
import thirdIcon from '@/assets/img/third-icon.png'
import fourthIcon from '@/assets/img/fourth-icon.png'

/*export default {
  name: 'HomeView',
  components: {},
}*/
</script>

<style scoped>
.bg-image {
  background-image: url('@/assets/img/bg-home.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

h2 {
  font-family: 'familjen-grotesk', sans-serif;
  font-size: 19px;
  color: #0557b6;
  font-style: italic;
  font-weight: 600;
  padding-left: 9%;
  padding-top: 22% !important;
}

.home-btn {
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  color: white;
  font-family: 'familjen-grotesk', sans-serif;
  font-size: 17px;
  font-weight: 700 !important;
  padding: 9px 22px;
  border-radius: 20px 0;
  margin-left: 9%;
  margin-top: 15px;
  text-transform: none;
  transition: background-position 0.5s ease;
}
.home-btn span {
  font-weight: 600;
}

.home-btn:hover {
  background-position: right center;
}

/*Footer-icon*/
.footer-icons {
  margin-left: 10%;
  margin-top: 26%;
  display: flex;
  gap: 30px;
  /*justify-content: center;*/
  flex-wrap: wrap; /* ensures it wraps on smaller screens */
  padding: 0;
  list-style: none;
}

.footer-icons li {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 160px;
  font-size: 11px;
  font-family: 'familjen-grotesk', sans-serif;
  font-weight: 600;
  color: #04448d;
  line-height: 1.4;
  animation: floatUpDown 3s ease-in-out infinite;
}

/* Floating animation like water */
@keyframes floatUpDown {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}

.footer-icons img {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
  border: 1px solid #04448d;
  border-radius: 50%;
}
</style>
