import "dotenv/config";
import express from "express";
import AppError from "./helpers/appError";
import connectDB from "./helpers/connection";
import { apiV1Prefix, API_KEY, PORT } from "./helpers/constants";
import { appConfig } from "./helpers/utils";
import routes from "./routes";

const app = express();

connectDB().connect(function (err) {
  if (err) return console.log(err, err.message);
  console.log("db connected 🔥🔥🔥");
});

// process.env.NODE_ENV = "development";
process.env.NODE_ENV = "production";

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 🚫 downing server... ");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(err, err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 🚫 closing server... ");
  process.exit(1);
});

// configuring app
appConfig(app);

let apiprefix = apiV1Prefix + API_KEY;
// check if the api key is valid
app.use((req, res, next) => {
  const valid = req.originalUrl.search(API_KEY);
  if (valid < 0) return next(new AppError("please provide a valid api key"));
  next();
});

console.log(apiprefix);

// all routes
routes(app, apiprefix);

const server = app.listen(PORT, () => {
  console.log("Listening on port " + PORT || 5000);
});
