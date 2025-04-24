<!-- OrderSummary.vue -->
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

              <v-card-text>
                <div v-for="(order, index) in orders" :key="index">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-row>
                        <v-col cols="12">
                          <h6>Order Option:</h6>
                          <p>{{ order.selected.join(', ') || 'None' }}</p>
                        </v-col>
                        <v-col cols="12">
                          <h6>Delivery Address:</h6>
                          <p>{{ order.address }}</p>
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
                          <p>{{ order.quantity }} Gallons</p>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" class="text-right">
                      <p>
                        <strong>Subtotal: ₱{{ getSubtotal(order) }}.00</strong>
                      </p>
                      <p v-if="order.quantity >= 12">
                        <strong>Discount: ₱{{ getDiscount(order) }}.00</strong>
                      </p>
                      <p class="text-h6">
                        <strong>Total: ₱{{ getTotal(order) }}.00</strong>
                      </p>
                    </v-col>
                  </v-row>

                  <v-divider class="my-4"></v-divider>
                </div>

                <v-row>
                  <v-col cols="12" class="text-right">
                    <h3>
                      <strong>Total All Orders: ₱{{ totalAllOrders }}.00</strong>
                    </h3>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn class="mr-4" outlined color="red" @click="cancelOrder">Cancel</v-btn>
                <v-btn class="mr-4" color="primary" @click="editOrder">Edit Order</v-btn>
                <v-btn color="success" @click="placeOrder">Place Order</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </NavigationBar>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavigationBar from '@/components/layout/NavigationBar.vue'

const route = useRoute()

const orders = computed(() => {
  try {
    return JSON.parse(route.query.orders || '[]')
  } catch {
    return []
  }
})

const getSubtotal = (order) => order.quantity * 25
const getDiscount = (order) => (order.quantity >= 12 ? 10 : 0)
const getTotal = (order) => getSubtotal(order) - getDiscount(order)

const totalAllOrders = computed(() => {
  return orders.value.reduce((total, order) => total + getTotal(order), 0)
})

const cancelOrder = () => {
  console.log('Order canceled')
}
const editOrder = () => {
  console.log('Editing order')
}
const placeOrder = () => {
  console.log('Order placed')
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
