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

// update user
const updateUser = catchAsync(async (req, res, next) => {});
// delete user

export default {
  getUsers,
  getUser,
};
