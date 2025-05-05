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
              <!--footer icons-->
              <div class="footer-style text-end">
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
            </div>
            <!--End footer icons-->
          </v-col>
        </v-row>

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
  background-image: url('@/assets/img/gif/bg-gif-gif.gif'); /*Ilisdi ra ani regine mae ug dako pa ggyud-- bg-gif */
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
.footer-style {
  display: flex;
  justify-content: end;
  margin-top: 200px;
  margin-right: 30px ;
}

.footer-icons {
  display: flex;
  gap: 40px; /* adjust this number to control the gap */
  flex-wrap: wrap;
  padding: 0;
  list-style: none;
  margin: 0;
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
  transition: transform 0.3s ease-in-out;
}

.footer-icons li:hover {
  transform: scale(1.1);
}

.footer-icons img {
  width: 50px;
  height: 50px;
  border-bottom: #02adef 5px solid;
  border-radius: 50%;
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
