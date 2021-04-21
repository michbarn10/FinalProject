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
    <div v-if="user">
      <div class="wrapper">
        <div class="search">
          <form class="pure-form">
            <i class="fas fa-search"></i
            ><input
              v-model="searchText"
              placeholder="What movie are you looking to Review?"
            />
          </form>
        </div>
      </div>
      <Movie-List :movies="movies" />
    </div>
    <Login v-else />
  </div>
</template>

<script>
import axios from "axios";
import MovieList from "../components/MovieList.vue";
import Login from "@/components/Login.vue";
export default {
  name: "Home",
  components: {
    MovieList,
    Login,
  },
  data() {
    return {
      searchText: "",
      movies: [],
    };
  },
  async created() {
    this.getMovies();
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
    async getMovies() {
      try {
        let response = await axios.get("/api/movies");
        this.movies = response.data;
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
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Lucida Console", "Courier New", monospace;
}

.search {
  border: 2px solid rgb(122, 18, 18);
  border-radius: 5px;
  width: 50%;
}

form {
  display: table;
  width: 100%;
}

i {
  display: table-cell;
  padding-left: 10px;
  width: 1px;
}

input {
  display: table-cell;
  font-size: 20px;
  border: none !important;
  box-shadow: none !important;
  width: 100%;
  height: 40px;
}

button {
  font-family: "Lucida Console", "Courier New", monospace;
  margin: 5px;
  background: darkred;
  color: white;
  border-radius: 3px;
}
</style>
