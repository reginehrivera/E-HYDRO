import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReviewStore = defineStore('reviewStore', () => {
  const reviews = ref([])

  // Load reviews from localStorage if they exist
  function loadReviewsFromLocalStorage(stationId) {
    const storedReviews = JSON.parse(localStorage.getItem(stationId))
    if (storedReviews && storedReviews.length > 0) {
      reviews.value = storedReviews
    }
  }

  // Save reviews to localStorage
  function saveReviewsToLocalStorage(stationId) {
    localStorage.setItem(stationId, JSON.stringify(reviews.value))
  }

  function addReview(stationId, review, user) {
    reviews.value.push({
      stationId,
      ...review,
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto,
    })

    // Save to localStorage after adding a new review
    saveReviewsToLocalStorage(stationId)
  }

  function getReviewsByStation(stationId) {
    return reviews.value.filter((r) => r.stationId === stationId)
  }

  // Expose methods for load/save
  return {
    reviews,
    addReview,
    getReviewsByStation,
    loadReviewsFromLocalStorage,
    saveReviewsToLocalStorage,
  }
})
