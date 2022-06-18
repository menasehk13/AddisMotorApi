import { catchAsync } from "../middlewares/error";
import connectDB from "../helpers/connection";
import adminQuery, { addDriverSales } from "../queries/admin";
import userQuery from "../queries/user"
import driverQuery from "../queries/driver"
import AppError from "../helpers/appError";
import {SocketModulet} from '../app'
import jwt from "jsonwebtoken";
import { Notification,NotificationSingle } from '../utils/notification.js'
import bcrypt from "bcryptjs";
import { staticFilePath } from "../helpers/utils";
import { json } from 'express/lib/response';
import {NotificationAll} from '../utils/notification'
import { NetworkContext } from "twilio/lib/rest/supersim/v1/network";

const DB = connectDB();


// get users
const currentAdmin = catchAsync(async (req, res, next) => {
  const {id} = jwt.decode(req.query.token);
  console.log(id)
  DB.query(`SELECT * FROM admin WHERE id=${id} LIMIT 1`, function (err, results, fields) {
    if (err) return next(new AppError(err.message, 400));
    return res.json({ user: results });
  });
});

// get admins [just if needed]
const getAdmins = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.getadmins(), function (err, admins) {
    if (err) return next(new AppError(err.message, 400));
    return res.json({
      status: "success",
      admins,
    });
  });
});

//register user from web
const addDriverweb = catchAsync(async (req,res,next)=>{
  console.log(req.body)
  DB.query(adminQuery.addDriverSales(req.body),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
      let id = results.insertId
      DB.query(adminQuery.addNewUserCar(req.query.driverid,id),(err,results)=>{
        if(err) return next(new AppError(err.message,400))
        res.json({"status":"Driver Car registered successfully"})
      })
  })
})
const UploadProfilePic = catchAsync(async (req,res,next)=>{
 const id = req.query.id
 const imageupload = staticFilePath(req.file.filename)
 DB.query(adminQuery.updateProfile(imageupload,id),(err,results)=>{
  if(err) next(new AppError(err.message,400))
  return res.json("User Image Updated")
 })

})
const addDriverDocuments = catchAsync(async (req, res, next) => {
  const data = req.body
  const id = req.query.id;
  console.log(req.file, req.query);
  console.log(req.files["insurancepic"]?.fieldname)
  // res.json({ hmm : req.files})
 data.licencepic= staticFilePath(req.files["licencepic"][0].filename)
data.insurancepic = staticFilePath(req.files["insurancepic"][0].filename)
data.registration = staticFilePath(req.files["registration"][0].filename)
data.criminal = staticFilePath(req.files["criminal"][0].filename)
  DB.query(adminQuery.addDriverDocumentSales(id,data),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json({"status":"Driver Successfully Registered"})
  })
})

// get admin by email [just if needed]
const getAdmin = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.getadmin(req.params.email), function (err, admin) {
    if (err) return next(new AppError(err.message, 400));

    if (!admin) return next(new AppError("No admin found", 404));
    return res.json(results);
  });
});

// dashboard overview
const dashboard = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.dashboard(req.query.limit), (err, drivers) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(
        drivers);
  });
});

const activeDriver = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.activeDriver(req.query.status),(err,drivers)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(drivers)
  })
})
// getdrivers
const getDrivers = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.drivers(), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});

const getUsers = catchAsync(async (req,res,next) =>{
DB.query(adminQuery.users(),(err,results)=>{
  if(err) return next(new AppError(err.message,400))
  return res.json(results)
})

})

// getdriver
const getDriver = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.driverdetail(req.query.id), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});

// getdriverDocument
const driverDocument = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.driverdetaildocument(req.params.id), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});

// getdriverReview
const driverReview = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.driverdetailreview(req.params.id), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});

// getdriverOrders
const driverOrder = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.driverdetailorder(req.query.id), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});
// get order details
const driverOrderDetail = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.driverorderDetail(req.query.id),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(results)
  })
})
// getaccounting
const accounting = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.accounting(), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});

// getaccounting driver
const accountingDrivers = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.accountingdrivers(), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});

// getaccounting riders
const accountingRiders = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.accountingriders(), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});

// getaccounting service
const accountingService = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.accountingaddservice(req.body), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});

// add new Service
const addAccountingService = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.accountingaddservice(req.data), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});

// getmarkating
const marketing = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.marketingcoupon(), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});
// add coupun
const marketingCoupon = catchAsync(async (req, res, next) => {
const title= req.body.title
const discription=req.body.description
  DB.query(adminQuery.addmarketing(),req.body, (err, results) => {
    if (err) return next(new AppError(err.message, 400));
   NotificationAll(title,discription)
    return res.json({"status":"Uploaded"});
  });
});
// usercomplients
const userComplaints = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.complaints(), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});
// selectedComplaints
const selectedComplaints = catchAsync(async (req, res, next) => {
  DB.query(adminQuery.selectedComplaints(req.params.id), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
  });
});
// car service
const carServices = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.carService(),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(results)
  })

})
// dispatch service 
const selectDispatch = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.dispatchService(req.body),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(results)
  })
})

// updateComplaints
const updateComplaints = catchAsync(async (req, res, next) => {
  DB.query(
    adminQuery.updateComplaints({ ...req.body, ...req.params }),
    (err, results) => {
      if (err) return next(new AppError(err.message, 400));
      return res.json(results);
    }
  );
});
// rating view driver id 
const Rating = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.ratingReview(req.query.id),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    console.log(err)
    return res.json(results)
  })
})
// driver document lists

const DocumentList = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.DriverDocumentList(req.query.id),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
    return res.json(results)
  })
})
// updatestatus 
const updatestatus = catchAsync(async(req,res,next)=>{
  DB.query(adminQuery.UpdateDriverStatus(req.query.id),(err,results)=>{
    if(err) next(new AppError(err.message,400))
     DB.query(driverQuery.getdriver(req.query.id),(err,drivers)=>{
      let notificationId = drivers[0].notificationid
      // changes for commit 
        Notification("GREAT NEWS !!!!! ","Your Documents Has Been Approved You can Start Earning More ",notificationId)
        return res.json({"Status":"driver info Updated"})
     })
  })
})

const DispatchToDriver = catchAsync(async (req,res,next)=>{
  const id =req.query.id
  console.log(id)
  console.log(req.body)
  DB.query(driverQuery.getdriver(id),(err,results)=>{
    if(err) next(new AppError(err.message,404))
      const socketid = results[0].socketid
      const notificationId = results[0].notificationid
      let notifiy=[]
      notifiy.push(`${notificationId}`)
      console.log(notifiy)
      Notification("Driver From Dispatch","Custumer near you Needs A Ride",notifiy)
      SocketModulet.to(socketid).emit("dispatchDriver",req.body)
    return  res.json({"status":"Send to Driver"})
  })
})
// accounting user data
const accountingUser = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.accountinguser(),(err,results)=>{
    if(err) next(new AppError(err.message,400))
    res.json(results)
  })
})
// dashboard count
const dashboardIcons = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.dashboardIcons(),(err,results)=>{
    if(err) next(new AppError(err.message,400))
    res.json(results)
  })
})
// send dispatch 
const DispatchFromDriver = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.dispatchFromDriver(),(err,results)=>{
    if(err) next(new AppError(err.message,400))
    res.json(results)
  })
}) 
// view all admins
const viewadmins = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.viewAdmin(),(err,results)=>{
    if(err) next(new AppError(err.message,400))
    res.json(results)
  })
})
// delete admin
const deleteadmin = catchAsync(async (req,res,next)=>{
  DB.query(adminQuery.deleteAdmin(req.query.id),(err,results)=>{
    if(err) next (new AppError(err.message,400))
  return  res.json({"status":"Deleted Account"})
  })
})

// send notification to users
const sendNotificationToUser= catchAsync(async (req,res,next)=>{
const {title,discription}= req.body
DB.query(userQuery.getusers(),(err,results)=>{
  if(err) next (new AppError(err.message,400))
  const notificationId = results[0].notificationid
      let notifiy=[]
      notifiy.push(`${notificationId}`)
      //console.log(notifiy)
      Notification(title,discription,notifiy)
      res.json({"status":"Send to Driver"})
})
});

// send notification to Drivers
const sendNotificationToDriver = catchAsync(async (req,res,next)=>{
  const {title,discription}= req.body
  DB.query(driverQuery.getdrivers(),(err,results)=>{
    if(err) next (new AppError(err.message,400))
    const notificationId = results[0].notificationid
        let notifiy=[]
        notifiy.push(`${notificationId}`)
        //console.log(notifiy)
        Notification(title,discription,notifiy)
        res.json({"status":"Send to Driver"})
  });
});

// send notificationtoSingleDriver
const sendSingleNotification = catchAsync(async (req,res,next)=>{
  const {title,discription}= req.body
  const id = req.query
  DB.query(driverQuery.getdriver(id),(err,results)=>{
    let notificationId = results[0].notificationid
    // changes for commit 
      NotificationSingle(title,discription,notificationId)
      return res.json({"Status":"driver info Updated"})
  })
})
// const add credit to driver via admin panel

const AddCredit = catchAsync(async (req,res,next)=>{
  const {ammount,id} = req.query
  DB.query(adminQuery.addCreditToDriver(id,ammount),(err,results)=>{
    if(err) return next(new AppError(err,400))
    DB.query(driverQuery.getdriver(id),(errs,result)=>{
      if(err) return next(new AppError(errs,400))
      let notificationId = result[0].notificationid
      let recharedAmmountbe = result[0].currency
      console.log(notificationId)
      // changes for commit 
        NotificationSingle("Addis Motor Taxi",`You have Recharged your Account, Your Current Account Balance is ${recharedAmmountbe}`,notificationId)
        return res.json({"Status":"driver info Updated"})
    })
  })
})

export default {
  dashboard,
  getAdmin,
  getAdmins,
  getDriver,
  getDrivers,
  driverDocument,
  driverReview,
  driverOrder,
  accounting,
  accountingDrivers,
  accountingRiders,
  accountingService,
  addAccountingService,
  marketing,
  marketingCoupon,
  userComplaints,
  selectedComplaints,
  updateComplaints,
  activeDriver,
  driverOrderDetail,
  getUsers,
  carServices,
  selectDispatch,
  currentAdmin,
  addDriverweb,
  addDriverDocuments,
  Rating,
  DocumentList,
  UploadProfilePic,
  updatestatus,
  DispatchToDriver,
  accountingUser,
  dashboardIcons,
  DispatchFromDriver,
  viewadmins,
  deleteadmin,
  sendNotificationToUser,
  sendNotificationToDriver,
  sendSingleNotification,
  AddCredit
};
