<template>
  <div>
    <div id="menu">
      <div id="brand">
        <router-link to="/">
          <img src="../assets/globe.jpeg" />
        </router-link>
      </div>
      <div id="side">
        <button v-if="user" @click="logout">Sign Out</button>
        <router-link to="/">
          <div class="menu-item home">
            <img src="../assets/llamas.jpeg" />
            <p>Home</p>
          </div>
        </router-link>
        <router-link to="/reviews">
          <div class="menu-item">
            <img src="../assets/tv.png" />
            <p>Reviews</p>
          </div>
        </router-link>
      </div>
    </div>
    <div v-if="this.reviews.length == 0">
      <h1>There are no reviews to view.</h1>
    </div>
    <div v-else><Review-List /></div>
    <!-- <div v-else><Review-List :reviews="reviews" :movies="movies" /> -->
  </div>
</template>

<script>
import axios from "axios";
import ReviewList from "../components/ReviewList.vue";
export default {
  name: "Reviews",
  components: {
    ReviewList,
  },
  data() {
    return {
      reviews: [],
      movies: [],
    };
  },
  async created() {
    this.getReviews();
    try {
      let response = await axios.get("/api/users");
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async getReviews() {
      try {
        let response = await axios.get("/api/reviews");
        this.reviews = response.data;
        if (this.reviews) {
          let movieResponse = await axios.get("/api/movies");
          this.reviews.forEach((review) => {
            const movieExists = this.getMovieFromReview(review.movieId);
            if (!movieExists) {
              this.movies.push(
                movieResponse.data.find((movie) => movie.id == review.movieId)
              );
            }
          });
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
      } catch (error) {
        console.log(error);
        this.$root.$data.user = null;
      }
    },
    getMovieFromReview(movieId) {
      return this.movies.find((movie) => movie.id == movieId);
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 16px;
  background: #8b0000;
}
button {
  font-family: "Lucida Console", "Courier New", monospace;
  margin: 5px;
  background: darkred;
  color: white;
  border-radius: 3px;
}
</style>
