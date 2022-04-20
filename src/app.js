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
import {Notification} from "./utils/notification";
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
  secure: true,
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  allowEIO3: true
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
 let  driver = []
  socket.on("data", async (d) => {
    const datas = (await JSON.parse(d)) || d;
    console.log(datas)
    DB.query(userQuery.requestDriver(datas), (err, drivers, fields) => {
      if (err) console.log(err.message);
      console.log(drivers);
      if (drivers.length > 0) {
        driver=drivers
        socket.broadcast
          .to(drivers.map((driver) => driver.socketid)).emit("userfound", datas);
      } else {
        return console.log("No User Found");
      }
      // socket.on("test1",(msg)=>{
      //   console.log(msg)
      // })
      // socket.on("rideaccepted", (data) => {
      //   const result = JSON.parse(data) || data;
      //   console.log(result)
      //   const unlucky = { status: "taken" };
      //   drivers.splice(drivers.findIndex((item) => item.id === result.driverid),1);
      //   socket.broadcast.to(drivers.map((driver) => driver.socketid)).emit("alreadytaken", unlucky);
      //   socket.broadcast.to(result.socketid).emit("newdriverfound", result);
      //   console.log(drivers)
      // });
    });
  });
  socket.on("rideaccepted",(data) => {
    const result = JSON.parse(data) || data;
        console.log(result)
      const unlucky = { status: "taken" };
      driver.splice(driver.findIndex((item) => item.id === result.driverid),1);
      socket.broadcast.to(driver.map((driver) => driver.socketid)).emit("alreadytaken", unlucky);
      console.log(driver)
      socket.broadcast.to(result.socketid).emit("newdriverfound", result);  
  });
  socket.on("journeystarted", (data) => {
    const result = JSON.parse(data) || data;
    console.log(result)
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
  Notification("THIS IS IT!","HOW ARE YOU DOING","a3e04666-8b8a-4d06-bf81-52d53e392adc")
  res.send("API>>>> CONNECTED>:");
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
