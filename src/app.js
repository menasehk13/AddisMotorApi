import "./helpers/config"
import express from "express";
import AppError from "./helpers/appError";
import connectDB, { DB } from "./helpers/connection";
import { apiV1Prefix, API_KEY, PORT } from "./helpers/constants";
import { appConfig } from "./helpers/utils";
import routes from "./routes";
import http from "http";
import cors from 'cors';
import {Server} from "socket.io";
import path from "path";
import userQuery from "./queries/user";
import driverQuery from "./queries/driver"

const app = express();
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(
  "static",
  express.static(path.join(__dirname.replace("\\src", ""), "public"))
);
app.set("view engine", "ejs")

const server = http.createServer(app);

const io = new Server(server,{'pingTimeout': 180000, 'pingInterval': 25000,cors: { origin: '*' }});

let sock;

io.on("connection", (socket) => {
  sock = socket;

  socket.on("message", (message) => {
  });

  // socket.on("")
  socket.on("dispatchDriver",(data)=>{
    io.to(data.driverid).emit("userfound",data)
  })

  socket.on("cancel",(msg)=>{
    const result = JSON.parse(msg)
    io.to(result.socketid).emit("canceled",result) 
  });
  
  socket.on("test", (msg) => {
   // io.emit('driver', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
  })
  socket.on("data",(d) =>{
    const data = JSON.parse(d) || d
    DB.query(userQuery.requestDriver(data), (err, drivers, fields) => {
      if(err) console.log(err.message)
      
      if(drivers.length>0){
        console.log(drivers)
        io.to(drivers.map(driver => driver.socketid)).emit("userfound",data)
      }else{
        return console.log("No User Found")
      }
     
    })
  })
    socket.on("rideaccepted",(data)=>{
      const result = JSON.parse(data)
        io.to(result.socketid
          ).emit("driverfound",result) 
       
      });

  socket.on("journeystarted",(data)=>{
    const result = JSON.parse(data)
      io.to(result.socketid).emit("started",result)
      
  })

  socket.on("journeyfinished",(data)=>{
    const result = JSON.parse(data) || data
    io.to(result.socketid).emit("finished",result)
   
  })


  socket.on("test", (msg) => console.log(msg))
  
  socket.on("disconnect", (reason) => { 
  });
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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get("/form", (req,res) => {
  res.render("index")
})

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
