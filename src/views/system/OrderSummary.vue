<template>
  <NavigationBar>
    <template #content>
      <v-container fluid class="order-bg">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="order-container">
              <v-card-title class="text-h5">
                <span>Order Summary</span>
              </v-card-title>
              <v-card-subtitle>
                <span>Review your order before confirming.</span>
              </v-card-subtitle>

              <v-divider></v-divider>

              <!-- Order details section -->
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-row>
                      <v-col cols="12">
                        <h6>Order Option:</h6>
                        <p>Refill Only</p>
                      </v-col>
                      <v-col cols="12">
                        <h6>Delivery Address:</h6>
                        <p>177 Cancer St., Montilla Blvd Highway, Brgy JP Rizal</p>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-row>
                      <v-col cols="12">
                        <h6>Gallon Details:</h6>
                        <p>Aquabon Water Refilling Station</p>
                        <p>₱ 25.00 per gallon</p>
                      </v-col>
                      <v-col cols="12">
                        <h6>Quantity:</h6>
                        <p>2 Gallons</p>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-divider></v-divider>

                <!-- Price and total -->
                <v-row>
                  <v-col cols="12" class="text-right">
                    <p><strong>Subtotal: ₱50.00</strong></p>
                    <p><strong>Discount: ₱5.00</strong></p>
                    <p class="text-h6"><strong>Total: ₱45.00</strong></p>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>

              <!-- Buttons -->
              <v-card-actions>
                <v-btn class="mr-4" outlined color="red">Cancel</v-btn>
                <v-btn class="mr-4" color="primary">Edit Order</v-btn>
                <v-btn color="success">Place Order</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </NavigationBar>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'

// Ref to hold the order details
const orderOption = ref('Refill Only')
const deliveryAddress = ref('177 Cancer St., Montilla Blvd Highway, Brgy JP Rizal')
const gallonPrice = ref(25) // price per gallon
const quantity = ref(2) // quantity of gallons
const discount = ref(5) // discount on bulk order

// Computed property for the subtotal
const subtotal = computed(() => gallonPrice.value * quantity.value)

// Computed property for the total price after discount
const totalPrice = computed(() => subtotal.value - discount.value)

// Methods for editing the order (you can expand these methods based on the flow you need)
const cancelOrder = () => {
  console.log('Order canceled')
  // Implement your cancel logic here
}

const editOrder = () => {
  console.log('Editing order')
  // Implement your edit logic here
}

const placeOrder = () => {
  console.log('Order placed')
  // Implement your place order logic here
}
</script>

<style scoped>
.order-bg {
  background-image: url('@/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  min-height: 100vh;
  padding-top: 100px;
}

.order-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 12px;
}
</style>
