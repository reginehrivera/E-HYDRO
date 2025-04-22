<template>
<div class="layout">
  <MyAccountView/>
</div>
<main>
  <v-btn class="btn" :style="{ background: '#64B5F6' }">
   + Add Address
</v-btn>

  <v-card
        class="v-cardv2"
        height="500"
        width="900"
        hover
        :style="{ background: 'linear-gradient(10deg,#BBDEFB,#C5CAE9)' }"
      >
      <v-col cols="12" sm="6">
          <v-text-field
            label="underlined"
            model-value="John Doe"
            variant="underlined"
            readonly
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            label="underlined"
            model-value="John Doe"
            variant="underlined"
            readonly
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            label="underlined"
            model-value="John Doe"
            variant="underlined"
            readonly
          ></v-text-field>
        </v-col>  
    </v-card>

</main>

</template>

<script>
import MyAccountView from '@/views/MyAccountView.vue'
export default {
  components: {
   MyAccountView,
  },
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Takes up full viewport height */
}

main {
  flex-grow: 1; /* Ensures main content grows and fills available space */
   padding: 20px;
 }
 .v-cardv2 {
  position: relative;
  right: -30rem;
  top: -40rem;
  padding: 35px;
}
.btn{
  position: relative;
  right: -75rem;
  top:-41rem;
}

</style>
