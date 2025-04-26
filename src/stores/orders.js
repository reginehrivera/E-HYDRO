import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [],
    selectedFilter: 'All', // Default to 'All' filter
    totalDiscount: 0,
    totalNewGallon: 0,
    finalTotal: 0,
  }),

  getters: {
    // Filter orders based on selected status
    filteredOrders(state) {
      if (state.selectedFilter === 'All') {
        return state.orders
      }
      return state.orders.filter((order) => order.status === state.selectedFilter)
    },
  },

  actions: {
    // Adds a new order to the orders list
    addOrder(order) {
      this.orders.push(order) // Add the order to the list
      this.updateTotals() // Update totals after adding a new order
    },

    // Removes an order from the orders list by its index
    removeOrder(index) {
      this.orders.splice(index, 1) // Remove order at the given index
      this.updateTotals() // Update totals after removing an order
    },

    // Updates the overall totals based on the current orders
    updateTotals() {
      let subtotal = 0
      let discount = 0
      let newGallonTotal = 0

      // Loop through each order to calculate totals
      this.orders.forEach((order) => {
        const base = order.quantity * 25 // Base cost for the order
        const hasNewGallon = order.selected.includes('Buy with New Gallon (₱100)') // Check if 'New Gallon' option is selected
        const addon = hasNewGallon ? order.quantity * 100 : 0 // Add extra cost if 'New Gallon' is selected
        subtotal += base + addon // Add the total for the order

        // Updated discount logic (₱10 discount per 12 gallons ordered)
        discount += Math.floor(order.quantity / 12) * 10

        if (hasNewGallon) {
          newGallonTotal += order.quantity * 100 // Add total for new gallon orders
        }
      })

      // Set the updated values to state
      this.totalNewGallon = newGallonTotal
      this.totalDiscount = discount
      this.finalTotal = subtotal - discount // Final total after applying discounts
    },

    // Set the orders list to a new set of orders
    setOrders(newOrders) {
      this.orders = newOrders
      this.updateTotals() // Update totals whenever orders are set
    },

    // Set the filter status
    setFilter(status) {
      this.selectedFilter = status
    },

    // Update the status of an individual order
    updateOrderStatus(orderId, newStatus) {
      const order = this.orders.find((order) => order.id === orderId)
      if (order) {
        order.status = newStatus
        this.updateTotals() // <-- Added this to refresh totals if needed
      }
    },
  },
})
