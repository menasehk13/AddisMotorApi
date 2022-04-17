import "./helpers/config";
import express from "express";
import AppError from "./helpers/appError";
import connectDB, { DB } from "./helpers/connection";
import { apiV1Prefix, API_KEY, PORT } from "./helpers/constants";
import { appConfig } from "./helpers/utils";
import routes from "./routes";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";
import userQuery from "./queries/user";
import driverQuery from "./queries/driver";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(
  "static",
  express.static(path.join(__dirname.replace("\\src", ""), "public"))
);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  allowEIO3: true,
});

let sock;
io.on("connection", async (socket) => {
  sock = socket;

  socket.on("message", (message) => {});

  // socket.on("")
  socket.on("dispatchDriver", (data) => {
    console.log(data);
    socket.on("rideaccepteddispacth", (data2) => {
      console.log(data2);
    });
  });
  socket.on("cancel", (msg) => {
    const result = JSON.parse(msg);
    io.to(result.socketid).emit("canceled", result);
  });
  socket.on("test", (msg) => {
    // io.emit('driver', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
  });
  socket.on("data", async (d) => {
    const data = (await JSON.parse(d)) || d;
    DB.query(userQuery.requestDriver(data), (err, drivers, fields) => {
      if (err) console.log(err.message);
      console.log(drivers);
      if (drivers.length > 0) {
        socket.broadcast
          .to(drivers.map((driver) => driver.socketid))
          .emit("userfound", data);
        socket.on("rideaccepted", (data) => {
          const result = JSON.parse(data) || data;
          // send it to the drivers who are un lucky
          const unlucky = { status: "taken" };
          drivers.splice(
            drivers.findIndex((item) => item.id === result.driverid),
            1
          );
          socket.broadcast
            .to(drivers.map((driver) => driver.socketid))
            .emit("alreadytaken", unlucky);
          io.emit("driverfound", result);
          console.log(result);
        });
      } else {
        return console.log("No User Found");
      }
    });
  });
  socket.on("journeystarted", (data) => {
    const result = JSON.parse(data);
    io.to(result.socketid).emit("started", result);
  });

  socket.on("journeyfinished", (data) => {
    const result = JSON.parse(data) || data;
    io.to(result.socketid).emit("finished", result);
  });

  socket.on("test", (msg) => console.log(msg));

  socket.on("disconnect", (reason) => {});
});

export { io, sock };

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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/form", (req, res) => {
  res.render("index");
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

server.listen(PORT, () => {
  console.log("Listening on port " + PORT || 5000);
});
