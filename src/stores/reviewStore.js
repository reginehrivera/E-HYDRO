import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReviewStore = defineStore('reviewStore', () => {
  const reviews = ref([])

  function addReview(stationId, review, user) {
    reviews.value.push({
      stationId,
      ...review,
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto,
    })
  }

  function getReviewsByStation(stationId) {
    return reviews.value.filter((r) => r.stationId === stationId)
  }

  return { reviews, addReview, getReviewsByStation }
})
