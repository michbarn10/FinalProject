<template>
  <div class="wrapper">
    <div class="reviews">
      <div class="review" v-for="(review, index) in reviews" :key="review.id">
        <div class="image">
          <img :src="require(`@/assets/Movies/${getMoviePicture(review)}`)" />
        </div>
        <div class="info">
          <h1>{{ review.reviewName }}</h1>
          <h2>{{ review.userReview }}</h2>
        </div>
        <div class="name">
          <h3>{{ review.movieName }}</h3>
        </div>
        <div
          v-if="
            user && user.firstName + ' ' + user.lastName == review.reviewName
          "
          class="deleteReview"
        >
          <button @click="deleteReview(index)">Delete this review</button>
        </div>
        <div
          v-if="
            user && user.firstName + ' ' + user.lastName == review.reviewName
          "
          class="deleteReview"
        >
          <button @click="toggleEdit(index)">Edit this review</button>
        </div>
        <div class="review" v-if="showEdit[index]">
          <input
            type="text"
            v-model="userReview[index]"
            placeholder="Type the new text here..."
          />
          <button @click="editReview(index)">Update Your Review</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ReviewList",
  data() {
    return {
      reviews: [],
      movies: [],
      showEdit: [],
      userReview: [],
    };
  },
  created() {
    this.getReviews();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    toggleEdit(index) {
      const oldVal = this.showEdit[index];
      this.showEdit.splice(index, 1, !oldVal);
    },
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

            this.showEdit.push(false);
          });
        }
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteReview(index) {
      try {
        await axios.delete("/api/Review/" + this.reviews[index]._id);
        this.reviews.splice(index, 1);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    getMovieFromReview(movieId) {
      return this.movies.find((movie) => movie.id == movieId);
    },
    getMoviePicture(review) {
      let moviePicture = this.getMovieFromReview(review.movieId);
      if (moviePicture) {
        return moviePicture.image;
      } else {
        return "";
      }
    },
    async editReview(index) {
      try {
        await axios.put("/api/Review/" + this.reviews[index]._id, {
          userReview: this.userReview[index],
        });

        let response = await axios.get("/api/reviews");
        this.reviews = response.data;
        this.toggleEdit(index);
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

.reviews {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.review {
  margin: 10px;
  margin-top: 50px;
  width: 200px;
}

.review img {
  border: 2px solid #333;
  height: 250px;
  width: 200px;
  object-fit: cover;
}

.review .image {
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
.deleteReview {
  margin: 5px;
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
  width: 90%;
  margin: 5px;
}
</style>
