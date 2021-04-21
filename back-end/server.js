const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/cp4", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["secretValue"],
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

const reviewSchema = new mongoose.Schema(
  {
    reviewName: String,
    userReview: String,
    movieId: String,
  },
  { collection: "review" }
);

const ReviewItem = mongoose.model("review", reviewSchema);

const movieSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    rating: String,
    genre: String,
    year: Number,
    image: String,
  },
  { collection: "movie" }
);

const MovieItem = mongoose.model("movie", movieSchema);

app.get("/api/movies", async (req, res) => {
  try {
    let items = await MovieItem.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/api/reviews", async (req, res) => {
  try {
    let items = await ReviewItem.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/api/Review", async (req, res) => {
  const item = new ReviewItem({
    reviewName: req.body.reviewName,
    userReview: req.body.userReview,
    movieId: req.body.movieId,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete("/api/Review/:id", async (req, res) => {
  try {
    await ReviewItem.deleteOne({
      _id: req.params.id,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put("/api/Review/:id", async (req, res) => {
  try {
    let item = await ReviewItem.findOne({
      _id: req.params.id,
    });
    item.userReview = req.body.userReview;
    item.save();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

const users = require("./users.js");
app.use("/api/users", users.routes);

app.listen(3003, () => console.log("Server listening on port 3003!"));
