// get users

import { catchAsync } from "../middlewares/error";

// get users
const getUsers = catchAsync(async (req, res, next) => {
  res.send(" getting users from Controller");
});

// get user
const getUser = catchAsync(async (req, res, next) => {
  res.send("from Controller");
});

// create/register user

// update user

// delete user

export default {
  getUsers,
  getUser,
};
