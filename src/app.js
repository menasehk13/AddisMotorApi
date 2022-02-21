import express from "express";
import { connect } from "mongoose";

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use("/static", express.static("public"));

connectDB();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

function connectDB() {
  try {
    connect("mongodb://localhost:27017/ridy-test", () => {
      console.log("db connected 🔥");
    });
  } catch (err) {
    console.log(err.message);
  }
}
