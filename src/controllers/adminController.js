import { catchAsync } from "../middlewares/error";
import connectDB from "../helpers/connection";
import adminQuery, { addDriverSales } from "../queries/admin";
import AppError from "../helpers/appError";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { staticFilePath } from "../helpers/utils";
import { json } from 'express/lib/response';

const DB = connectDB();


// get users
const currentAdmin = catchAsync(async (req, res, next) => {
  const {id} = jwt.decode(req.query.token);
  DB.query(`SELECT * FROM Admin WHERE id=${id} LIMIT 1`, function (err, results, fields) {
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
  const data = req.body
  console.log(req.body);
 data.photo = staticFilePath(req.file.filename)
  DB.query(adminQuery.addDriverSales(data),(err,results)=>{
    if(err) return next(new AppError(err.message,400))
      let id = results.insertId
      DB.query(adminQuery.addNewUser(data,id),(err,results)=>{
        if(err) return next(new AppError(err.message,400))
        res.json({"status":"user registered successfully"})
      })
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
  DB.query(adminQuery.addmarketing(req.body), (err, results) => {
    if (err) return next(new AppError(err.message, 400));
    return res.json(results);
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
  addDriverDocuments
};
