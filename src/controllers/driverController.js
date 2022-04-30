import { DB } from "../helpers/connection";
import driverQuery from "../queries/driver";
import { catchAsync } from "../middlewares/error";
import bcrypt from "bcryptjs";
import AppError from "../helpers/appError";
import { io, sock } from "../app";
import { staticFilePath } from "../helpers/utils";
import { json } from "express/lib/response"
import { Notification } from '../utils/notification.js'

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

  if(data.photo) data.photo = staticFilePath(req.file.filename)
  else return next(new AppError("Please upload your profile picture"))

  DB.query(driverQuery.add_driver(), data, function (err, result) {
    if (err) return next(new AppError(err.message, 400));


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
const driverstatus = catchAsync(async function(req,res,next){
  DB.query(driverQuery.driverStatus(req.query.id),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(results[0])
  })
})
 
const history = catchAsync(async function (req, res, next) {
  DB.query(
    driverQuery.history(req.query.driverid),
    function (err, result, fields) {
      if (err) return next(new AppError(err.message, 400));

      return res.json(result);
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
  DB.query(driverQuery.journey(),req.body,(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({status:"success",journeyid:results.insertId})
  })
})
// payement 
const payment = catchAsync(async (req,res,next)=>{
  DB.query(driverQuery.payment(),req.body,(err,results)=>{
    if(err) return next(new AppError(err.message,400))

    return res.json({status: "success",paymentid:results.insertId})
  })
})

const addhistory = catchAsync ( async (req,res,next)=>{
  DB.query(driverQuery.addHistory(),req.body,(err,results)=>{
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
  DB.query(driverQuery.booking(),data,(err,results)=>{
    if(err) return next(new AppError(err.message,400))

    return res.json({status:"success",bookingid:results.insertId})
  })
})
const updateDriverSocket = catchAsync(async function (req, res, next) {
  const data = req.body;
  const { id } = req.query;
  
  DB.query(
    driverQuery.updateDriverSocket({ ...data, id }),
    function (err, result, fields) {
      if (err) {
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


const rating = catchAsync(async (req,res,next)=>{
  
  DB.query(driverQuery.viewRating(req.query.id),(err,results)=>{
   if(err) return next(new AppError(err.message,400))
   return res.json({user:results[0]})
  })
})

const carDetail = catchAsync(async (req,res,next)=>{
  DB.query(driverQuery.carInfo(req.query.id),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    if(results.length > 0) return res.json({user:results[0]})
    return res.json({status:"no data"})
  })
})

const checkUserexsist = catchAsync(async (req,res,next)=>{
  DB.query(driverQuery.checkUser(req.query.phonenumber),(err,results)=>{
    if(err) next(new AppError(err.message,400))
    if(results.length>0){
      return res.json({user:results})
    }else{
      return next(new AppError("No User Registered By This Number?"),400)
    }
   
  })
})
const updatePassword = catchAsync(async(req,res,next)=>{
  let hashpassword = req.query.password
  var password=  await bcrypt.hash(hashpassword, 12); 
  DB.query(driverQuery.updatePassword(password,req.query.id),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({"status":"updated"})
  })
})
// update notification controll 
const updateNotification = catchAsync(async (req,res,next)=>{
  const id = req.query.id
  const notificationid = req.query.notificationid
  DB.query(driverQuery.updateNotification(id,notificationid),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({"status":"updatedNotification"})
  })
})
// buy currency credit

const BuyNewCredit = catchAsync(async (req,res,next)=>{
  const driverid = req.query.driverid
  const currencyid = req.query.currencyvalue
     DB.query(driverQuery.BuyCredit(currencyid),(err,results)=>{
       if(err) return next(new AppError(err.message,400))
       if(results && results.length>0 ){
        const idUsed = results[0].id
        const CurrentValue = results[0].currencyValue
        console.log(idUsed)
          DB.query(driverQuery.addCredit(driverid,CurrentValue),(error,results)=>{
            if(err) return next(new AppError(error.message,400))
              DB.query(driverQuery.updateCurrenceyValue(idUsed),(errors,result)=>{
                if(errors) return res.json({"status":"Fail"})
                 return res.json({"status":"Ok"})
              })
          })
       }else{
         return res.json({"status":"Fail"})
       }
     })
})
//
const BankCredit = catchAsync(async (req,res,next)=>{
  const credit = req.query.credit
  const id = req.query.id
  DB.query(driverQuery.CurrencyUpdate(credit,id),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
     DB.query(driverQuery.getdriver(id),(err,results)=>{
      let notificationid = results[0].notificationid
      Notification("CREDIT UPDATE...",`You Currency Have been Recharged Through Abyssinya Bank. you have added ${credit} to Your Addis Motor Driver Account`,notificationid)
      res.json({"Status":"Updated Your Currency "})
     })
   
  })
})
export default {
  getDrivers,
  getDriver,
  addDriver,
  displayStatus,
  history,
  updateCurrentLocation,
  updateDriverSocket,
  updatestatus,
  totalprice,
  priceid,
  payment,
  bookingData,
  journeyStarted,
  addhistory,
  rating,
  carDetail,
  driverstatus,
  checkUserexsist,
  updatePassword,
  updateNotification,
  BuyNewCredit,
  BankCredit
};
