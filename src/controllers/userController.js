// get users

import { catchAsync } from "../middlewares/error";
import connectDB from "../helpers/connection";
import userQuery from "../queries/user";
import AppError from "../helpers/appError";

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
  DB.query(userQuery.getuser(req.params.id), function (err, results, fields) {
    if (err) return next(new AppError(err.message, 400));
    return res.json({ user: results });
  });
});

// create/register user [implemented on authController.js]
 const createUser = catchAsync(async (req, res , next) => {
   DB.query(userQuery.adduser(req.body),(err,results)=>{
     if(err) return next( new AppError(err.message,400))
     return res.json({message:Succsess ,
     user: results})
   })
 })
// update user
const updateUser = catchAsync(async (req, res, next) => {
  DB.query(userQuery.edituser(req.params.id),(err,results)=>{
      if(err) return next( new AppError(err.message,400))
      return res.json({message:Success ,
      user:results})
  })
});
// nearby driver
const nearbyDriver = catchAsync(async (req, res, next) => {
  DB.query(userQuery.nearbyDriver(req.body),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({drivers:results})
  })
})
// online driver view
const onlineDriver = catchAsync(async (req, res, next) => {
  DB.query(userQuery.getallDriver(),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({divers:results})
  })
})
//
// found driver 
const foundDriver = catchAsync (async (req, res, next) => {
  /* TODO:
   listen to the message recived from the driver  message = accept
   then add id of user and driver to the database
  */  
  DB.query(userQuery.driverfound(),(err,results) => {
    
  })

})
const journeyLocation = catchAsync (async (req, res, next) =>{
  /* 
   TODO:
   listen to the message recived from message = start
   then add to journey table
  */
 DB.query(userQuery.journeystarted(req.body),(err,results)=>{
   if(err) return next(new AppError(err.message,400))
   return res.json(results)
 })
})
// cancel drive

const journeyStarted = catchAsync (async (req, res, next) => {
  DB.query(userQuery.journeystarted(),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(results)
  })  
})
// payment
const payment = catchAsync (async (req, res, mext) => {
  DB.query(userQuery.payment(req.body),(err,results) => {
    if(err) return next(new AppError(err.message,400))
    return res.json(results)
  })
})
// delete user

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  nearbyDriver,
  onlineDriver,
  foundDriver,
  journeyLocation,
  journeyStarted,
  payment
};
