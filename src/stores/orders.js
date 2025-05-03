// stores/orders.js
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [], // Start with empty orders array
    selectedFilter: 'All',
    totalDiscount: 0,
    totalNewGallon: 0,
    finalTotal: 0,
  }),

  getters: {
    filteredOrders(state) {
      if (state.selectedFilter === 'All') {
        return state.orders
      }
      return state.orders.filter((order) => order.status === state.selectedFilter)
    },
  },

  actions: {
    addOrder(order) {
      this.orders.push(order)
      this.updateTotals()
    },

    removeOrder(index) {
      this.orders.splice(index, 1)
      this.updateTotals()
    },

    updateTotals() {
      let subtotal = 0
      let discount = 0
      let newGallonTotal = 0

      this.orders.forEach((order) => {
        const base = order.quantity * 25
        const hasNewGallon = order.selected && order.selected.includes('Buy with New Gallon (₱100)')
        const addon = hasNewGallon ? order.quantity * 100 : 0
        subtotal += base + addon

        discount += Math.floor(order.quantity / 12) * 10

        if (hasNewGallon) {
          newGallonTotal += order.quantity * 100
        }
      })

      this.totalNewGallon = newGallonTotal
      this.totalDiscount = discount
      this.finalTotal = subtotal - discount
    },

    // Clear existing orders when a user logs out
    clearOrders() {
      this.orders = []
      this.updateTotals()
    },

    // Set the orders list to a new set of orders
    setOrders(newOrders) {
      this.orders = newOrders || [] // Ensure we never set undefined or null
      this.updateTotals()
    },

    setFilter(status) {
      this.selectedFilter = status
    },

    updateOrderStatus(orderId, newStatus) {
      const order = this.orders.find((order) => order.id === orderId)
      if (order) {
        order.status = newStatus
        this.updateTotals()
      }
    },
  },
})
