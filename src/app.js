import "dotenv/config";
import express from "express";
import connectDB from "./helpers/connection";
import { apiV1Prefix, PORT } from "./helpers/constants";
import { appConfig } from "./helpers/utils";
import routes from "./routes";

const app = express();

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

// all routes
routes(app, apiV1Prefix);

const server = app.listen(PORT, () => {
  console.log("Listening on port " + PORT || 5000);
});
