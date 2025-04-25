// stores/reviewStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReviewStore = defineStore('reviewStore', () => {
  const reviews = ref([]) // All reviews

  function addReview(stationId, review) {
    reviews.value.push({
      stationId,
      ...review
    })
  }

  function getReviewsByStation(stationId) {
    return reviews.value.filter(r => r.stationId === stationId)
  }

  return { reviews, addReview, getReviewsByStation }
})
