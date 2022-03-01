// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "../helpers/appError";
import { DB } from "../helpers/connection";
import { JWTSecretKey } from "../helpers/constants";
import { signToken, createSendToken, simpleGetUser } from "../helpers/utils";
import { catchAsync } from "../middlewares/error";
import jwt from "jsonwebtoken";
import userQuery from "../queries/user";
import driverQuery from "../queries/driver";
import adminQuery from "../queries/admin";
import { promisify } from "util";

const register = catchAsync(async (req, res, next) => {
  const data = req.body;
  const type = req.query.type || "driver";

  if (type != "user") data.password = await bcrypt.hash(data.password, 12);

  let query;
  if (type == "driver") query = driverQuery.add_driver();
  else if (type == "admin") query = adminQuery.addadmin();
  else query = userQuery.adduser();

  DB.query(query, data, function (err, results, fields) {
    console.log(err, data, query);
    if (err) return next(new AppError(err.message, 400));

    createSendToken(data, 200, res);
  });
});

const login = catchAsync(async (req, res, next) => {
  // get user credentials from req.body
  const { email, password } = req.body;

  let type = req.query.type;

  // check that auth is for admin or driver
  const query = `SELECT * FROM ${type} WHERE email='${email}'`;

  // check if fields are not empty
  if (!email || !password)
    return next(new AppError("Please provide email and password", 404));

  DB.query(query, async function (err, data, fields) {
    if (err) return next(new AppError(err.message, 400));

    const user = data[0];

    // check if email is in the db
    if (!user) return next(new AppError("sorry, unregistered email"));

    // compare the password associated with the email and password from request
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return next(new AppError("incorrect password", 400));
    // If everything ok, send token to client

    createSendToken(user, 200, res);
  });
});

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

export default {
  login,
  protect,
  register,
  restrictTo,
};
