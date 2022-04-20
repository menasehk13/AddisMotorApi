// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "../helpers/appError";
import { DB } from "../helpers/connection";
import {  JWTSecretKey, TWILIO_ACCOUNTSID, TWILIO_ACCOUNT_SID,TWILIO_SERVICE_ID } from "../helpers/constants";
import { signToken, createSendToken, simpleGetUser, staticFilePath } from "../helpers/utils";
import { catchAsync } from "../middlewares/error";
import jwt from "jsonwebtoken";
import userQuery from "../queries/user";
import driverQuery from "../queries/driver";
import adminQuery from "../queries/admin";
import { promisify } from "util";
import twillioClient from "../helpers/twillioClient";

const register = catchAsync(async (req, res, next) => {
  const data = req.body;
  const type = req.query.type || "driver";

  if(type != "user" ) data.password = await bcrypt.hash(data.password, 12);

  
  if(req.file?.fieldname == "profile") data.photo = staticFilePath(req.file.filename)

  let query;
  if (type == "driver") {
    query = driverQuery.add_driver();
  }
  else if (type == "admin") query = adminQuery.addadmin();
  else if(type == "user") query = userQuery.adduser();

  else return next(new AppError("Invalid user type", 400));

  DB.query(query, data, function (err, results, fields) {

    if (err) return next(new AppError(err.message, 400));

    if(type == "driver") {
      sendPhoneVerification(data.phonenumber, next);
      
    }

    createSendToken(data, results, 200, res);
  });
});

const login = catchAsync(async (req, res, next) => {
  // get user credentials from req.body
  const { email, password, phonenumber } = req.body;

  let type = req.query.type || "user";

  // check that auth is for admin or driver

  let query = `SELECT * FROM ${type} WHERE phonenumber='${phonenumber}'`

  if(type == 'admin'){
    query = `SELECT * FROM ${type} WHERE email='${email}'`;
    
    if (!email || !password) return next(new AppError("Please provide email and password", 404));
  } else if(type == 'driver') {
    if (!phonenumber || !password) return next(new AppError("Please provide phone number and password", 404));
  } else {
    if(type == 'user' && !phonenumber) return  next(new AppError("Please enter your phone number", 404));
  }
    
  // check if fields are not empty
  
  DB.query(query, async function (err, data, fields) {
    if (err) return next(new AppError(err.message, 400));

    const user = data[0];

    // check if email is in the db
    if (!data[0] && type!="user") return next(new AppError("sorry, unregistered account"));

    // compare the password associated with the email and password from request
    let isPasswordCorrect;
    if(type != "user" ) {
      isPasswordCorrect = await bcrypt.compare(password, user.password);
    // await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return next(new AppError("incorrect password", 400));
    // If everything ok, send token to client
    } else{ 
       sendPhoneVerification(phonenumber, next,res)
       return  res.json({
          user
        })
        
    }
    createSendToken(user, data, 200, res);
  });
});

function sendPhoneVerification(phonenumber, next) {
  twillioClient
  .verify
  .services(TWILIO_SERVICE_ID)
  .verifications
  .create({ to: "+251" + phonenumber , channel: 'sms'})
  .then(data =>  {console.log(data.status)})
  .catch(er => {
    console.log(er)
    next(new AppError(er.message, 400))})
}

const resendVerification = catchAsync(async (req, res , next) => {
  const {phonenumber} = req.query;

  sendPhoneVerification(phonenumber, next)
})

const verify = catchAsync(async (req, res, next) => {
  const {code, phonenumber} = req.body;
  const type = req.query.type || 'user'
  twillioClient.verify
  .services(TWILIO_SERVICE_ID)
  .verificationChecks.create({ to: "+251" + phonenumber, code })
  .then(data => {
    if(data.valid) {
      DB.query(`SELECT * FROM ${type} WHERE phonenumber=${phonenumber} LIMIT 1`, function(err, result, fields) {
        if(err) next(new AppError(err ,err.message));
        const user = result[0]
        if(user) {
          return res.json({
            message: `${type} verified successfully`,
            status:`${type} Already Registered`,
            user
          })
        }else{
          return res.json({
            message:`New ${type} Added`,
            status:`${type} verified successfully`
          })
        }
      })
    }
  } )  
  .catch(err =>{
    console.log(err)
    if(err.code == 20404) return next(new AppError("Invalid Verification code ", 400));
    return next(new AppError(err.message, 400))
  });

})
const rsendCode = catchAsync(async (req,res,next)=>{
  sendPhoneVerification(req.query.phonenumber,next,res)
})
const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, JWTSecretKey);
  const query = simpleGetUser(req, decoded.id);

  // 3) Check if user still exists
  DB.query(query, function (err, data, fields) {
    if (err) return next(new AppError(err.message, 400));

    const currentUser = data[0];

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  });
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'operator']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

const updatePassword = catchAsync(async (req, res, next) => {
    const {id, type="driver"} = req.query;
    const {newPassword,} = req.body;

    if(type == "driver") {
      DB.query(`select password from driver where id=${id} limit=1`, (error, result) => {
         if(error) return next(new AppError(error.message,403))
         
      })
    }

    let query = `UPDATE 
      ${type}
      SET
      phonenumber = "phonenumber"
      WHERE id = "driver id";`

    
    DB.query("select * from ")
})

export default {
  login,
  verify,
  protect,
  register,
  restrictTo,
  rsendCode
};
