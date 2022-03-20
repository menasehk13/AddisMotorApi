import { DB } from "../helpers/connection";
import driverQuery from "../queries/driver";
import { catchAsync } from "../middlewares/error";
import bcrypt from "bcryptjs";
import AppError from "../helpers/appError";
import { io, sock } from "../app";
import { staticFilePath } from "../helpers/utils";
import { json } from "express/lib/response";

const getDrivers = catchAsync(async function (req, res, next) {
  DB.query(driverQuery.getdrivers(), function (err, drivers, fields) {
    if (err) return next(new AppError(err.message, 400));

    return res.json(drivers);
  });
});

const getDriver = catchAsync(async function (req, res, next) {
  const {id} = req.query;
  DB.query(
    driverQuery.getdriver(id),
    function (err, result, fields) {
      if (err) return next(new AppError(err.message, 400));
      const driver = result[0];

      if(!driver) return next(new AppError(`Found No Driver with id [${id}] `))

      // console.log(result, );
      
      // sock.emit("driver", driver);

      // sock.on("test", msg => console.log(msg))

      return res.json({
        status: "success",
        user: driver,
      });
    }
  );
});

const addDriver = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (!data.password)
    return next(new AppError("Please input your password", 400));

  data.password = await bcrypt.hash(data.password, 12);
  data.photo = staticFilePath(req.file.filename);

  DB.query(driverQuery.add_driver(), data, function (err, result) {
    if (err) return next(new AppError(err.message, 400));

    // console.log();

    return res.json({
      status: "success",
      message: "Driver registered successfully",
      user: result,
    });
  });
});

const updateCurrentLocation = catchAsync(async (req, res, next) => {
  const data = req.body;
  const { id } = req.query;

  DB.query(
    driverQuery.updatecurrentlocation({ ...data, id }),
    function (err, result, fields) {
      if (err) return next(new AppError(err.message, 400));
      
      return res.json({
        status: "success",
        message: "Driver location updated successfully",
        user: result,
      });
    }
  );
});
const updatestatus = catchAsync(async (req,res,next)=>{
  const data = req.body;
  const {id} = req.query;
  DB.query(driverQuery.updateStatus({...data,id}),(err,result,fields)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({
      status: "success",
      message: "status Updated",
    })
  })
})

const totalprice = catchAsync(async (req,res,next)=>{
  DB.query(driverQuery.totalPrice(req.query.id),(err,result)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(result[0])
  })
})

const history = catchAsync(async function (req, res, next) {
  DB.query(
    driverQuery.history(req.params.driverid),
    function (err, result, fields) {
      if (err) return next(new AppError(err.message, 400));

      return res.json({
        status: "success",
        message: "driver history loaded successfully",
        history: result,
      });
    }
  );
});

const displayStatus = catchAsync(async function (req, res, next) {
  DB.query(
    driverQuery.displaystatus(req.params.driverid),
    function (err, result, fields) {
      if (err) return next(new AppError(err.message, 400));

      return res.json({
        status: "success",
        status: result,
      });
    }
  );
});
// journey
const journeyStarted = catchAsync(async (req,res,next)=>{
  DB.query(driverQuery.journey(req.data),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({status:"success",journeyid:results.insertId})
  })
})
// payement 
const payment = catchAsync(async (req,res,next)=>{
  DB.query(driverQuery.payment(req.body),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({status: "success"})
  })
})

const priceid = catchAsync(async (req,res,next)=>{
  DB.query(driverQuery.priceId(req.query.id),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(results[0])
  })
})
const bookingData = catchAsync(async (req,res,next)=>{
  const data = req.body
  DB.query(driverQuery.booking(data),(err,results)=>{
    if(err) return next(new AppError(err.message,400))

    return res.json({status:"success",bookingid:results.insertId})
  })
})
const updateDriverSocket = catchAsync(async function (req, res, next) {
  const data = req.body;
  const { id } = req.query;
  console.log(req.body, req.query);
  
  DB.query(
    driverQuery.updateDriverSocket({ ...data, id }),
    function (err, result, fields) {
      if (err) {
        console.log(err);
        return next(new AppError(err.message, 400));
      }
      return res.json({
        status: "success",
        message: "driver update succesful",
        driver: result,
      });
    }
  );
});


// MIGRATED FROM USER

// online driver view
const onlineDriver = catchAsync(async (req, res, next) => {
  // DB.query(driverQuery.getOnlineDrivers(), (err, results) => {
  //   if (err) return next(new AppError(err.message, 400));

  io.on("driver", (...args) => {
    console.log(...args);
  });

  return res.json({ divers: "results" });
  // });
});

export default {
  getDrivers,
  getDriver,
  addDriver,
  displayStatus,
  history,
  updateCurrentLocation,
  onlineDriver,
  updateDriverSocket,
  updatestatus,
  totalprice,
  priceid,
  payment,
  bookingData,
  journeyStarted
  
};
