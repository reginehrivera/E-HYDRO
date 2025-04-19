<script setup>
</script>

<template>
      <v-container fluid class="bg-image">
        <!--first row-->
        <v-row>
          <v-col col="12" md="6">
            <div class="title-phrase">
              <h4 class="first-phrase">
                Stay hydrated<v-icon class="icon-style">mdi-water</v-icon>
              </h4>
              <!---->
            </div>
          </v-col>
          <!--Search Barr Area-->
          <v-col col="12" md="6" class="search-bar">
            <v-form class="search-form" role="search">
              <v-row no-gutters>
                <v-col cols="9" class="search-input">
                  <v-text-field
                    variant="outlined"
                    placeholder="Search for water stations nearby..."
                    density="comfortable"
                    hide-details
                    class="fst-italic"
                    prepend-inner-icon="mdi-magnify"
                    aria-label="Search"
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-btn type="submit" class="search-btn" color="" block
                    ><span>Search </span></v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
        <!--end first row-->
        <slot name="dashboardcontent"></slot>
      </v-container>
</template>

<style scoped>
.bg-image {
  background-image: url('@/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}
.title-phrase {
  font-family: 'familjen-grotesk', sans-serif;
  font-size: 23px !important;
  color: #04448d;
  font-style: italic;
  padding-left: 15%;
  padding-top: 11% !important;
}

@keyframes water-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.icon-style {
  font-size: 35px;
  color: #02adef;
  animation: water-bob 2s infinite ease-in-out;
}

.first-phrase {
  font-weight: 700;
  font-family: 'Faustina', serif;
}
.first-phrase {
  margin-bottom: -0.6rem;
}

/*-------Search Bar---------*/

.search-bar {
  padding-top: 10%;
  padding-right: 8%;
}
.search-input {
  position: relative;
}

/* Animated gradient border */
.search-input .v-text-field {
  position: relative;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  color: #fff;
  overflow: hidden;
  z-index: 1;
}

/* The running border using a ::before pseudo-element */
.search-input .v-text-field::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  z-index: -1;
  border-radius: 12px;
  background: linear-gradient(270deg, #90caf9, #42a5f5, #89c4dd, #408db3, #90caf9);
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

.search-btn {
  width: 100%;
  height: 93%;
  background: linear-gradient(120deg, #0557b6, #011327, #0557b6);
  background-size: 200% auto;
  background-position: left center;
  transition: background-position 0.5s ease;
  margin-top: 0.11rem;
}
.search-btn:hover {
  background-position: right center;
}
.search-btn span {
  font-family: 'inter', sans-serif;
  font-weight: 600;
  text-transform: none;
  color: #fff;
}
/*-------End Search Bar---------*/

/*-------Station Style-------*/
.station-container {
  background-color: #bee1ed7e;
}

</style>
