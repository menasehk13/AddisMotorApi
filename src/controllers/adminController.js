
import { catchAsync } from "../middlewares/error";
import connectDB from "../helpers/connection";
import adminQuery from "../queries/admin";
import AppError from "../helpers/appError";
import admin from "../queries/admin";

const DB = connectDB()

// dashboard overview
const  dashboard =  catchAsync (async (req, res, next) => {
    DB.query(adminQuery.dashboard(req.body),(err,results) =>{
        if(err) return next(new AppError(err.message,400))
        return res.json(results)
    })
})
// getdrivers
const getDrivers = catchAsync(async (req, res, next) => {
    DB.query(adminQuery.drivers,(err,results) =>{
        if(err) return next (new AppError(err.message,400))
        return res.json(results)
    })
})
// getdriver
const getDriver = catchAsync(async (req, res, next) =>{
    DB.query(adminQuery.driverdetail(req.params.id),(err,results)=>{
        if(err) return next(new AppError(err.message,400))
        return res.json(results)
    })
})
// getdriverDocument
const driverDocument = catchAsync (async (req, res, next) =>{
    DB.query(adminQuery.driverdetaildocument(req.params.id),(err,results)=>{
        if(err) return next(new AppError(err.message,400))
        return res.json(results)
    })
})
// getdriverReview
const driverReview = catchAsync (async (req, res, next) => {
    DB.query(adminQuery.driverdetailreview(req.params.id),(err,results)=>{
        if(err) return next(new AppError(err.message,400))
        return res.json(results)
    })
})
// getdriverOrders
const driverOrder = catchAsync (async (req, res, next) => {
    DB.query(adminQuery.driverOrder(req.params.id),(err,results) => {
        if(err) return next(new AppError(err.message,400))
        return res.json(results)
    })
})
// getaccounting 
const accounting = catchAsync(async (req, res, next) => {
    DB.query(adminQuery.accountingdrivers(),(err,results)=>{
        if(err) return next(new AppError(err.message,400))
        return res.json(results)
    })
})
// getaccounting driver
const accountingDrivers = catchAsync (async (req, res, next) => {
    DB.query(adminQuery.accountingdrivers(),(err,results)=> {
        if(err) return next (new AppError(err.message,400))
        return res.json(results)
    })
})
// getaccounting riders
const accountingRiders = catchAsync (async (req, res, next) => {
    DB.query(adminQuery.accountingriders(),(err,results) => {
        if(err) return next(new AppError(err.message,400))
        return res.json(results)
    })
})
// getaccounting service
const accountingService = catchAsync (async (req, res, next) =>{
    DB.query(adminQuery.accountingaddservice(req.body),(err,results) => {
        if(err) return next (new AppError(err.message,400))
        return res.json(results)
    })
})
// add new Service
const addAccountingService = catchAsync (async (req, res, next) =>{
    DB.query(adminQuery.accountingaddservice(req.data),(err,results) => {
        if(err) return next (new AppError(err.message,400))
        return res.json(results)
    })
})
// getmarkating
const marketing = catchAsync (async (req, res, next) => {
    DB.query(adminQuery.marketingcoupon(),(err,results) => {
        if(err) return next (new AppError(err.message,400))
        return res.json(results)
    })
})
// add coupun
const marketingCoupon = catchAsync(async (req, res, next) => {
    DB.query(adminQuery.addmarketing(req.body),(err,results)=>{
        if(err) return next (new AppError(err.message,400))
        return res.json(results);
    })
})
// usercomplients
const userComplaints = catchAsync(async (req, res, next) => {
    DB.query(adminQuery.complaints(),(err,results) => {
        if(err) return next (new AppError(err.message,400))
        return res.json(results)
    })
})
// selectedComplaints
const selectedComplaints = catchAsync(async (req, res, next) => {
    DB.query(adminQuery.selectedComplaints(req.params.id ),(err,results) => {
        if(err) return next(new AppError(err.message,400))
        return res.json(results)
    })
})
// updateComplaints
const updateComplaints = catchAsync (async (req, res, next) => {
    DB.query(adminQuery.updateComplaints(req.body),(err,results) => {
        if(err) return next(new AppError(err.message,400))
        return res.json(results)
    })
})
export default{
    dashboard,
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
    updateComplaints
    

}