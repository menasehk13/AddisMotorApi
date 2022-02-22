// get users

import { catchAsync } from "../middlewares/error";
import connectDB from "../helpers/connection";
import userQuery from "../queries/user";

const DB = connectDB();

// get users
const getUsers = catchAsync(async (req, res, next) => {
  DB.query(userQuery.getusers(), function (err, results, fields) {
    console.log(results); // results contains rows returned by server
    return res.json({ user: results });
  });
  //   console.log(users);
});

// get user
const getUser = catchAsync(async (req, res, next) => {
  res.send("from Controller");
});

// create/register user
const createUser = catchAsync(async (req, res, next) => {
  const data = req.body;
  try {
  } catch (error) {}
});
// update user
const updateUser = catchAsync(async (req, res, next) => {});
// delete user

export default {
  getUsers,
  getUser,
};
