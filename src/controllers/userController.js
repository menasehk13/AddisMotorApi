import multer from "multer";
import { catchAsync } from "../middlewares/error";
import connectDB from "../helpers/connection";
import userQuery, { getService } from "../queries/user";
import AppError from "../helpers/appError";
import { staticFilePath } from "../helpers/utils";
import { url } from "../helpers/constants";
import jwt from "jsonwebtoken"

const DB = connectDB();

// get users
const getUsers = catchAsync(async (req, res, next) => {
  DB.query(userQuery.getusers(), function (err, results, fields) {
    if (err) return next(new AppError(err.message, 400));
    return res.json({ user: results });
  });
});

// get user
const getUser = catchAsync(async (req, res, next) => {
  DB.query(userQuery.getuser(req.query.id), function (err, results, fields) {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results[0]);
  });
});

// const createUserForm = catchAsync(async (req, res, next) => {
//   res.send(`
//     <form action="${url}/users" method="post" enctype="multipart/form-data">
//     <input type="text" name="firstname">
//     <input type="text" name="lastname">
//     <input type="email" name="email">
//     <input type="file" name="userprofile">
//     <input type="submit" value="Upload">
//     </form>
// `);
// });

// create/register user [implemented on authController.js]
const createUser = catchAsync(async (req, res, next) => {
  const data = req.body;


  if(data.profile) data.profile = staticFilePath(req.file.filename);
  
  DB.query(userQuery.adduser(), req.body, (err, results, fields) => {
    if (err) return next(new AppError(err.message, 400));

    return res.json({
      message: "Success",
    // user: results,
     id:results.insertId });
  });
});

// history
const historyView = catchAsync(async (req,res,next)=>{
  DB.query(userQuery.history(req.query.userid),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(results)
  })
}) 
// total price view
const totalDistance = catchAsync(async (req,res,next)=>{
  
  DB.query(userQuery.totaldistancePrice(req.query.serviceid,req.query.distance),(err,results)=>{
    if(err) next(new AppError(err.message,400))
    return res.json(results[0])
  })
})
// view rated driver 

const ratingView = catchAsync(async (req,res,next)=>{
  DB.query(userQuery.viewRating(req.query.id),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(results[0])
  })
})
// rate driver 
const rating = catchAsync(async (req,res,next)=>{
  DB.query(userQuery.ratingReview(),req.body,(err,results,fields) => {
    if(err) return next(new AppError(err.message,400));
    return res.json({ message: "Success"})
  })
})
// update user
const updateUser = catchAsync(async (req, res, next) => {
  const data = req.body;

  if(data.userprofile) data.userprofile = staticFilePath(req.file.filename);
  DB.query(
    userQuery.edituser(req.query.id),req.body,
    (err, results) => {
      if (err) return next(new AppError(err.message, 400));
      return res.json({ message: "Success", user: results });
    }
  );
});

// nearby driver -> NOT DONE
const nearbyDriver = catchAsync(async (req, res, next) => {
  DB.query(userQuery.viewDrivers(req.body), (err, results) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }
    return res.json({ user: results });
  });
});
// Driver Information
const driverinfo=catchAsync(async(req,res,next)=>{
  DB.query(userQuery.driverInfo(req.query.id),(err,results)=>{
    if(err){
      return next(new AppError(err.message,400))
    }
    return res.json(results[0])
  });
});

// found driver
const foundDriver = catchAsync(async (req, res, next) => {
  /* TODO:
   listen to the message recived from the driver  message = accept
   then add id of user and driver to the database
  */
  DB.query(userQuery.driverfound, (err, results) => {});
});

const journeyLocation = catchAsync(async (req, res, next) => {
  /* 
   TODO:
   listen to the message recived from message = start
   then add to journey table
  */
  DB.query(userQuery.journeystarted(req.body), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});
//get service
const Service = catchAsync(async (req, res, next) => {
  DB.query(userQuery.getService(), function (err, results, fields) {
    if (err) return next(new AppError(err.message, 400));
    return res.json( results );
  });
});
// payment
const payment = catchAsync(async (req, res, next) => {
  DB.query(userQuery.payment(req.body), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});
// socketupdate
const socket = catchAsync(async (req,res,next)=>{
  
  DB.query(userQuery.updateSocket(req.query.id,req.body.socketid),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({status:"updated"})
  })
})

//socket value
const requestDriver = catchAsync( async (req,res,next)=>{
    const data = req.body
    DB.query(userQuery.requestDriver(data),(err,results)=>{
      if(err) return next(new AppError(err.message,400))
      return res.json(results)
    })
})
// send  drivers location
const displayDriverLocation = catchAsync(async (req, res, next) => {
  const data  = req.body
  DB.query(userQuery.requestDriver(data), (err, drivers, fields) => {
    if(err) return next(new AppError(err.message, 400));
    return res.json(drivers)
  })
}) 
  const cancelService = catchAsync(async (req,res,next)=>{
 
  DB.query(userQuery.cancelReason(req.body),(err,results)=>{
    if(err) return next(new AppError(err.message,400));
    return res.json(results)
  })
  
  })
const Complients = catchAsync(async (req,res,next)=>{
  DB.query(userQuery.addComplients(),req.body,(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({"status":"Your Complain has been Submited"})
  })
})
  const reasons = catchAsync(async (req,res,next)=>{
    DB.query(userQuery.Reasons(),(err,results)=>{
      if(err) return next(new AppError(err.message,400))
      return res.json(results)
    })
  })
  const UpdateFirstDrive = catchAsync(async (req,res,next)=>{
    DB.query(userQuery.updateFirsttime(req.query.id),(err,results)=>{
      if(err) return next(new AppError(err.message,400))
      return res.json({"status":"updated"})
    })
  })
// delete user
const updateNotification = catchAsync(async (req,res,next)=>{
  const id = req.query.id
  const notificationid = req.query.notificationid
  DB.query(userQuery.updateNotification(id,notificationid),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({"status":"updatedNotification"})
  })
})
export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  nearbyDriver,
  driverinfo,
  foundDriver,
  journeyLocation,
  payment,
  Service,
  displayDriverLocation,
  rating,
  historyView,
  ratingView,
  cancelService,
  reasons,
  socket,
  requestDriver,
  UpdateFirstDrive,
  totalDistance,
  Complients,
  updateNotification
}