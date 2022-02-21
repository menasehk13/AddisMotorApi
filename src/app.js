import express from "express";
import connectDB from "./helpers/connection";
import { apiV1Prefix, port } from "./helpers/constants";
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
  console.log(err.name, err.message);
  console.log("UNHANDLED EXCEPTION! 🚫 downing server... ");
  process.exit(1);
});

// configuring app
appConfig(app);

// connect to db
connectDB();

// all routes
routes(app, apiV1Prefix);

const server = app.listen(port, () => {
  console.log("Listening on port " + port);
});
