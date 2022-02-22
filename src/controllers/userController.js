// get users

import { catchAsync } from "../middlewares/error";
import connectDB from "../helpers/connection";
// get users
const getUsers = catchAsync(async (req, res, next) => {
  res.send(" getting users from Controller");
});

// get user
const getUser = catchAsync(async (req, res, next) => {

  res.send("from Controller");
});

// create/register user
const createUser =  catchAsync(async (req, res, next) => {
 
  const data = req.body;
    try {
        
    } catch (error) {
      
    }

})
// update user
const updateUser = catchAsync(async (req, res, next) => {


})
// delete user

export default {
  getUsers,
  getUser,
};
