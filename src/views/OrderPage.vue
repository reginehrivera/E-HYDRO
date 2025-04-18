<template>
  <NavigationBar>
    <template #content>
      <v-container fluid class="order-bg">
        <div class="order-container">
          <h2 class="order-title">My Orders</h2>

          <!-- Filter Buttons -->
          <div class="filter-buttons">
            <button @click="filterOrders('All')" class="btn-border">ALL</button>
            <button @click="filterOrders('To Deliver')" class="btn-border">IN PROGRESS</button>
            <button @click="filterOrders('Completed')" class="btn-border">COMPLETED</button>
            <button @click="filterOrders('Cancelled')" class="btn-border">CANCELLED</button>
          </div>

          <!-- Order Cards -->
          <div class="order-card" v-for="(order, index) in filteredOrders" :key="index">
            <div class="order-info">
              <div class="order-top">
                <strong>Order #{{ order.id }}</strong>
                <span
                  :class="['status', order.status.toLowerCase().replace(' ', '-')]"
                  class="order-status"
                >
                  {{ order.status }}
                </span>
              </div>
              <p><strong>Station:</strong> {{ order.station }}</p>
              <p><strong>Address:</strong> {{ order.address }}</p>
              <p><strong>Date:</strong> {{ order.date }}</p>
              <p><strong>Quantity:</strong> {{ order.quantity }} gallons</p>
              <p><strong>Total:</strong> ₱{{ order.total.toFixed(2) }}</p>
            </div>
            <div class="order-actions" v-if="order.status === 'To Deliver'">
              <button class="btn-border" @click="promptCancel(index)">Cancel Order</button>
            </div>
          </div>

          <!-- Cancel Confirmation Modal -->
          <div class="modal" v-if="showCancelModal">
            <div class="modal-content">
              <p>Are you sure you want to cancel Order #{{ orders[cancelIndex].id }}?</p>
              <div class="modal-buttons">
                <button class="btn-primary" @click="cancelOrder">Yes</button>
                <button class="btn-border" @click="showCancelModal = false">No</button>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </template>
  </NavigationBar>
</template>

<script>
import NavigationBar from '@/components/layout/NavigationBar.vue'

export default {
  name: 'OrderPage',
  components: {
    NavigationBar,
  },
  data() {
    return {
      orders: [
        {
          id: 12345,
          station: 'AquaPure Station',
          address: 'Blk 8, Lot 2, Waterlane Subd.',
          date: 'April 18, 2025',
          quantity: 3,
          total: 180,
          status: 'To Deliver',
        },
        {
          id: 12346,
          station: 'HydroStation',
          address: 'Purok 3, Asinan',
          date: 'April 10, 2025',
          quantity: 2,
          total: 120,
          status: 'Completed',
        },
        {
          id: 12347,
          station: 'ClearWater Station',
          address: 'Blk 10, Lot 4, Sunpark Subd.',
          date: 'April 15, 2025',
          quantity: 5,
          total: 300,
          status: 'Cancelled',
        },
      ],
      filteredOrders: [],
      showCancelModal: false,
      cancelIndex: null,
    }
  },
  mounted() {
    // Initially display all orders
    this.filteredOrders = this.orders
  },
  methods: {
    filterOrders(status) {
      if (status === 'All') {
        // Show all orders
        this.filteredOrders = this.orders
      } else {
        // Filter orders by selected status
        this.filteredOrders = this.orders.filter((order) => order.status === status)
      }
    },
    promptCancel(index) {
      this.cancelIndex = index
      this.showCancelModal = true
    },
    cancelOrder() {
      this.orders[this.cancelIndex].status = 'Cancelled'
      this.showCancelModal = false
    },
  },
}
</script>

<style scoped>
.order-bg {
  background-image: url('@/assets/img/bg-home-no-gallon.png');
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding-top: 100px;
}

.order-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #c9f4ffb5;
  border-radius: 12px;
}

.order-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-buttons button {
  margin: 0 10px;
}

.order-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.order-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.status {
  font-weight: bold;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 13px;
}

.status.to-deliver {
  background-color: #f9c74f;
  color: #000;
}

.status.completed {
  background-color: #90be6d;
  color: white;
}

.status.cancelled {
  background-color: #ef476f;
  color: white;
}

.btn-primary {
  background-color: #02adef;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-border {
  background-color: transparent;
  border: 1px solid #02adef;
  color: #02adef;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-border:hover {
  background-color: #02adef;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
}

.modal-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
</style>
