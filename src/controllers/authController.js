// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import AppError from "../helpers/appError";
import { DB } from "../helpers/connection";
import { JWTSecretKey } from "../helpers/constants";
import { signToken } from "../helpers/utils";
import { catchAsync } from "../middlewares/error";
import User from "../models/User";
import userQuery from "../queries/user";

const register = catchAsync(async (req, res, next) => {
  const data = req.body;
  data.password = await bcrypt.hash(data.password, 12);

  DB.query(
    userQuery.adduser(data, function (err, results, fields) {
      if (err) return next(new AppError(err.message, 400));

      const token = signToken(results.userid);

      res.json({
        status: "success",
        message: "user registered successfully",
        data: {
          user: results,
        },
        token,
      });
    })
  );
});

const login = catchAsync(async (req, res, next) => {
  const { phone } = req.body;

  DB.query(userQuery.getuserbyphone(phone), function (err, user) {
    // const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // check if there is a user or the password is correct
    // if (!user || !isPasswordCorrect)
    //   return next(new AppError("Invalid credential"));

    // generating jwt token
    const token = jwt.sign({ id: user.userid }, JWTSecretKey);

    res.status(200).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  });
});

const protect = catchAsync(async (req, res, next) => {
  // get token and check if theres a token
  const { authorization } = req.headers;
  let token;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
    console.log(token);

    // verificating the token
    const decoded = await promisify(jwt.verify)(token, JWTSecretKey);

    console.log(decoded);

    // check if user still exists
    DB.query(userQuery.getuser(decoded.id), function (err, user) {
      if (user) return next();
      else return next(new AppError("Please provide a token"));
    });
  }
});

export default {
  login,
  protect,
  register,
};
