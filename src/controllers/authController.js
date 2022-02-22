import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../helpers/appError";
import { JWTSecretKey } from "../helpers/constants";
import { catchAsync } from "../middleware/error.mw";
import User from "../models/User";

const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  // check if there is a user or the password is correct
  if (!user || !isPasswordCorrect)
    return next(new AppError("Invalid credential"));

  // generating jwt token
  const token = jwt.sign({ id: user._id }, JWTSecretKey);

  res.status(200).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
});

const protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;
  if (req.body.userId && req.body.userId !== userId) {
    return next(new AppError("Invalid user ID", 402));
  } else {
    next();
  }
});

export default {
  login,
  protect,
};
