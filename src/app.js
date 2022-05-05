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
app.use(express.urlencoded())
app.use(express.json())
app.use(
  "static",
  express.static(path.join(__dirname.replace("\\src", ""), "public"))
);
app.set("view engine", "ejs");

const server = http.createServer(app);
var options = {
  allowUpgrades: true,
  transports: [ 'polling', 'websocket' ],
  pingTimeout: 9000,
  pingInterval: 3000,
  cookie: 'mycookie',
  httpCompression: true,
  cors: '*:*',
  allowEIO3: true
};
const io = new Server(server,options);

let sock;
let driver;

io.sockets.on("connection",(socket) => {
  sock = socket;
  // socket.on("")
  socket.on("dispatchDriver", (data) => {
    console.log(data);
  });

  socket.on("cancel", (msg) => {

    const result = JSON.parse(msg);
    console.log(result)
    socket.broadcast.to(result.driversocket).emit("canceled", result);

  });

  socket.on("data", (d) => {
    const datas = JSON.parse(d) || d;
    console.log(datas)
    DB.query(userQuery.requestDriver(datas), (err, drivers, fields) => {
      if (err) console.log(err.message);
      console.log(drivers);
      if (drivers.length > 0) {
        driver= drivers
        const id = drivers.map((drivers)=> drivers.notificationid)
      console.log(id)
        Notification("Rider near You!!!!",`Do you Wish To Accept A Ride Click ME.........`,id);
        socket.broadcast
          .to(drivers.map((driver) => driver.socketid)).emit("userfound", datas);
      } else {
        return console.log("No User Found");
      }
    });
  });
  socket.on("rideaccepted", async (data) => {
    const result = await JSON.parse(data) || data;
      const unlucky = { status: "taken" };
      let drivers = driver
      if(drivers!=null){
        drivers.splice(drivers.findIndex((item) => item.id === result.driverid),1);
        socket.broadcast.to(drivers.map((driver) => driver.socketid)).emit("alreadytaken", unlucky);
        socket.broadcast.to(result.socketid).emit("newdriverfound", result); 
        console.log(result)
      }else{
        console.log("no drivers near by")
      }
     
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

app.get("/", (req, res) => {
  
  Notification("THIS IS IT!","HOW ARE YOU DOING","a3e04666-8b8a-4d06-bf81-52d53e392adc")
  res.send("API>>>> CONNECTED>:");
});

connectDB().connect(function (err) {
  if (err) return console.log(err, err.message);
  console.log("db connected 🔥🔥🔥");
});

 process.env.NODE_ENV = "development";
//process.env.NODE_ENV = "production";

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
export const SocketModulet = io
server.listen(PORT, () => {
  console.log("Listening on port " + PORT || 5000);
});
