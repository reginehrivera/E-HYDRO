<template>
  <NavigationBar>
    <template #content>
      <v-app>
      <v-container fluid class="bg-image pb-0">
        <v-row>
          <v-col cols="12" md="5" class="pt-16 pb-0">
            <h1></h1>
            <p></p>
          </v-col>
          <v-col cols="12" md="7" class="pb-0 hero-h2">
            <h2>
              We provide clean, safe, and <br />worry-free water delivered right <br />
              to your doorstep.
            </h2>
            <router-link to="/station" class="home-btn-routerlink"
              ><v-btn class="home-btn">Order Now!</v-btn>
            </router-link>
          </v-col>
        </v-row>
         <!--footer icons-->
          <v-footer class="footer-style" app>
              <ul class="footer-icons">
                <li><img :src="firstIcon" alt="" />Convenient <br />Ordering</li>
                <li>
                  <img :src="secondIcon" alt="" />Affordable and <br />Quality Water
                </li>
                <li>
                  <img :src="thirdIcon" alt="" />Fast Water <br> Delivery
                </li>
                <li>
                  <img :src="fourthIcon" alt="" />Clean &<br />
                  Safe Water
                </li>
              </ul>
            </v-footer>
            <!--End footer icons-->
      </v-container>
    </v-app>
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
  background-image: url('@/assets/img/bg-bg-bg-bg-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  margin-bottom: 0%;
  padding-bottom: 0% !important;
}
.hero-h2{
  padding-bottom: 0%;
}
h2 {
  font-family: 'familjen-grotesk', sans-serif;
  font-size: 25px;
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
  font-family: 'Familjen Grotesk', Courier, monospace;
  font-size: 19px;
  font-weight: 700 !important;
  border-radius: 20px 0;
  width: 200px;
  height: 45px;
  margin-left: 9%;
  margin-top: 15px;
  text-transform: none;
  transition: background-position 0.5s ease;
  border-bottom: #02acefe3 3px solid;
  border-right: #02dfefa6 1px solid;
}


.home-btn:hover {
  background-position: right center;
}

/*Footer-icon*/
.footer-icons {
  margin-left: 10%;
  display: flex;
  gap: 90px;
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
  max-width: 200px;
  font-size: 12px;
  font-family: 'Inter', Courier, monospace;
  font-weight: 600;
  color: #04448d;
  line-height: 1.3;
  animation: floatUpDown 3s ease-in-out infinite;
}
.footer-icons li:hover{
  animation: floatUpDown 3s ease-in-out infinite;
  transform: scale(1.1);
  transition: transform 0.3s ease-in-out;
}

/* Floating animation like water
@keyframes floatUpDown {
  0% {
    transform: translateY(0px);
  }
  40% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}*/

.footer-icons img {
  width: 50px;
  height: 50px;
  border-bottom: #02adef 5px solid;
  border-radius: 50%;
}
.footer-style {
  justify-content: center;
}
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* full height of viewport */
}

.footer-style {
  margin-top: auto; /* push footer to bottom */
  background-color: #f8f8f8 !important; /* example background */
  padding: 20px;
  height: 16%;
  border-radius: 40px 40px 0 0;
}

.footer-icons {
  list-style: none;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
}

.footer-icons li {
  text-align: center;
}

/* Animated gradient border */
.footer-style {
  position: relative;
  background-color: rgba(255, 255, 255, 0.05);
  border-top: 4px solid #02acef34 !important;
  overflow: hidden;
  z-index: 1;
}

/* The running border using a ::before pseudo-element */
.footer-style:before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  z-index: -1;
  border-radius: 12px;
  background: linear-gradient(270deg, #90caf9b4, #42a4f5d0, #89c4ddd7, #408db3ad, #90caf998);
  background-size: 400% 400%;
  animation: gradient-run 6s ease infinite;
  opacity: 1; /* Always visible */
}

/* Animation keyframes */
@keyframes gradient-run {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

</style>
