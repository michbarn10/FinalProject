<template>
  <div class="wrapper">
    <div class="movies">
      <div class="movie" v-for="(movie, index) in movies" :key="movie.id">
        <div class="image">
          <img :src="require(`@/assets/Movies/${movie.image}`)" />
        </div>
        <div class="info">
          <h1>{{ movie.rating }}</h1>
          <h2>{{ movie.year }}</h2>
          <p>{{ movie.genre }}</p>
        </div>
        <div class="name">
          <h3>{{ movie.name }}</h3>
        </div>
        <div class="review">
          <input
            type="text"
            v-model="userReview[index]"
            placeholder="Type your review here..."
          />
          <button @click="addReview(index)">Publish Your Review</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "MovieList",
  data() {
    return {
      userReview: [],
    };
  },
  props: {
    movies: Array,
  },
  methods: {
    addToTheatre(movie) {
      this.$root.$data.theatre.push(movie);
    },
    async addReview(index) {
      try {
        await axios.post("/api/Review", {
          reviewName:
            this.$root.$data.user.firstName +
            " " +
            this.$root.$data.user.lastName,
          userReview: this.userReview[index],
          movieId: this.movies[index].id,
        });
        this.userReview.splice(index, 1, "");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.movies {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.movie {
  margin: 10px;
  margin-top: 50px;
  width: 200px;
}

.movie img {
  border: 2px solid #333;
  height: 250px;
  width: 200px;
  object-fit: cover;
}

.movie .image {
  display: flex;
  justify-content: center;
  margin-bottom: 7px;
}

.info {
  background: #8b0000;
  border-radius: 5px;
  color: rgb(255, 255, 255);
  padding: 10px 30px;
  height: 110px;
}

.info h1 {
  font-size: 16px;
  background: #8b0000;
}

.info h2 {
  font-size: 14px;
  background: #8b0000;
}

.info p {
  margin: 0px;
  font-size: 10px;
  background: #8b0000;
}

button {
  height: 50px;
  background: #8b0000;
  border-radius: 5px;
  color: white;
  border: none;
  font-family: "Lucida Console", "Courier New", monospace;
}

.auto {
  margin-left: auto;
}
.review .reviewName input {
  width: 100%;
  height: 30px;
  margin-bottom: 2px;
  border-radius: 5px;
}
.review {
  justify-content: center;
}
.review input {
  width: 100%;
  height: 70px;
  border-radius: 5px;
  margin-top: 5px;
}
.review button {
  height: 40px;
  background: #8b0000;
  color: rgb(255, 255, 255);
  border-radius: 5px;
  font-family: "Lucida Console", "Courier New", monospace;
  border: none;
  align-items: center;
}
</style>
